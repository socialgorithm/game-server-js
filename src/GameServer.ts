import { GAME_SOCKET_MESSAGE, GameMessage, Player } from "@socialgorithm/model";
import * as http from "http";
import * as io from "socket.io";
import { v4 as uuid } from "uuid";
import { Game, GameAndPlayers, GameOutputChannel, NewGameFn } from "./Game";
import { ServerOptions } from "./ServerOptions";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

export class GameServer {
    public io: SocketIO.Server;
    private games: Map<string, GameAndPlayers>;
    private playerToGameID: Map<Player, string>;
    private playerToSocket: Map<Player, io.Socket>;

    constructor(gameInfo: GameMessage.GameInfoMessage, private newGameFn: NewGameFn, serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.io = io(app);
        const port = serverOptions.port || 5433;

        app.listen(port);
        // tslint:disable-next-line:no-console
        console.log(`Started Socialgorithm Game Server on ${port}`);
        debug(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: io.Socket) => {
            socket.emit(GAME_SOCKET_MESSAGE.GAME_INFO, gameInfo);

            if (socket.handshake.query && socket.handshake.query.token) {
                // This is a uabc/player connection
                const token = socket.handshake.query.token;
                this.playerToSocket.set(token, socket);
                socket.on(GAME_SOCKET_MESSAGE.GAME__PLAYER, this.sendPlayerMessageToGame(token));

                // If all players in a game are connected, start the game
                const playersGame = this.playerToGameID.get(token);
                if (playersGame && this.allPlayersReady(playersGame)) {
                    this.games.get(playersGame).game.start();
                }
            }

            socket.on(GAME_SOCKET_MESSAGE.CREATE_GAME, this.createGame);
        });
    }

    public sendGameMessageToPlayer = (player: Player, payload: any) => {
        if (!this.playerToSocket.has(player)) {
            debug(`Socket not found for player ${player}, cannot send game message`);
            return;
        }

        this.playerToSocket.get(player).emit(GAME_SOCKET_MESSAGE.GAME__PLAYER, payload);
    }

    public sendGameUpdated = (socket: io.Socket, gameID: string) => (payload: any) => {
        const gameUpdatedMessage: GameMessage.GameUpdatedMessage = {
            payload,
        };
        socket.emit(GAME_SOCKET_MESSAGE.GAME_UPDATED,  { gameID, ...gameUpdatedMessage });
    }

    public sendGameEnded = (socket: io.Socket, gameID: string) => (gameEndedMessage: GameMessage.GameEndedMessage) => {
        socket.emit(GAME_SOCKET_MESSAGE.GAME_ENDED, { gameID, ...gameEndedMessage });
    }

    private createGame = (socket: io.Socket, createGameMessage: GameMessage.CreateGameMessage) => {

        // Convert player names to tokens - will be replaced when tournament-server uses secret tokens instead
        const playerGameTokens = this.generateGameTokens(createGameMessage.players);
        createGameMessage.players = createGameMessage.players.map(player => playerGameTokens.get(player));

        const gameOutputChannel: GameOutputChannel = {
            sendGameEnd: this.sendGameEnded(socket, createGameMessage.gameID),
            sendGameUpdate: this.sendGameUpdated(socket, createGameMessage.gameID),
            sendPlayerMessage: this.sendGameMessageToPlayer,
        };

        this.games.set(
            createGameMessage.gameID,
            {
                game: this.newGameFn(createGameMessage, gameOutputChannel),
                players: createGameMessage.players,
            },
        );
        createGameMessage.players.forEach(player => {
            this.playerToGameID.set(player, createGameMessage.gameID);
        });

        socket.emit(GAME_SOCKET_MESSAGE.GAME_CREATED, { playerGameTokens });
    }

    private sendPlayerMessageToGame = (player: Player) => (payload: any) => {
        // Find the game that the player is in, send message
        if (!this.playerToGameID.has(player)) {
            debug(`Player ${player} does not have an associated game, cannot send player's message`);
            return;
        }
        const gameId = this.playerToGameID.get(player);

        if (!this.games.has(gameId)) {
            debug(`Game ${gameId} not found, cannot send player ${player}'s message`);
        }

        this.games.get(gameId).game.onPlayerMessage(player, payload);
    }

    private generateGameTokens = (players: Player[]) =>
        new Map(players.map(player => [player, uuid()] as [string, string]))

    private allPlayersReady = (gameID: string) => {
        const requiredPlayers = this.games.get(gameID).players;
        const currentPlayers: Player[] = Object.entries(this.playerToGameID)
            .filter(entry => entry[1] === gameID)
            .map(entry => entry[0]);

        return requiredPlayers.every(requiredPlayer => currentPlayers.includes(requiredPlayer));
    }
}
