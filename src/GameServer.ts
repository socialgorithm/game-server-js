import * as http from "http";
import { v4 as uuid } from 'uuid';
import * as io from "socket.io";
import { Game, GameOutputChannel, NewGameFn, Player } from "./Game";
import { GameEndedMessage, GameInfoMessage, GameStartMessage, GameToPlayerMessage, GameUpdatedMessage, PlayerToGameMessage, GameStartedMessage } from './GameMessage';
import { GAME_SOCKET_MESSAGE } from "./GameSocketMessage";
import { ServerOptions } from "./ServerOptions";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

export class GameServer {
    public io: SocketIO.Server;
    private games: Map<string, Game>;
    private playerToGameID: Map<Player, string>;
    private playerToSocket: Map<Player, io.Socket>;

    constructor(gameInfo: GameInfoMessage, private newGameFn: NewGameFn, serverOptions?: ServerOptions) {
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
            }

            socket.on(GAME_SOCKET_MESSAGE.START_GAME, this.startGame);
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
        const gameUpdatedMessage: GameUpdatedMessage = {
            payload,
        };
        socket.emit(GAME_SOCKET_MESSAGE.GAME_UPDATED,  { gameID, ...gameUpdatedMessage });
    }

    public sendGameEnded = (socket: io.Socket, gameID: string) => (gameEndedMessage: GameEndedMessage) => {
        socket.emit(GAME_SOCKET_MESSAGE.GAME_ENDED, { gameID, ...gameEndedMessage });
    }

    private startGame = (socket: io.Socket, gameStartMessage: GameStartMessage) => {

        // Convert player names to tokens - will be replaced when tournament-server uses secret tokens instead
        const playerGameTokens = this.generateGameTokens(gameStartMessage.players);
        gameStartMessage.players = gameStartMessage.players.map(player => playerGameTokens.get(player));

        const gameOutputChannel: GameOutputChannel = {
            sendGameEnd: this.sendGameEnded(socket, gameStartMessage.gameID),
            sendGameUpdate: this.sendGameUpdated(socket, gameStartMessage.gameID),
            sendPlayerMessage: this.sendGameMessageToPlayer,
        };

        this.games.set(
            gameStartMessage.gameID,
            this.newGameFn(gameStartMessage, gameOutputChannel),
        );
        gameStartMessage.players.forEach(player => {
            this.playerToGameID.set(player, gameStartMessage.gameID);
        });

        socket.emit(GAME_SOCKET_MESSAGE.GAME_STARTED, { playerGameTokens });
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

        this.games.get(gameId).onPlayerMessage(player, payload);
    }

    private generateGameTokens = (players: Player[]) =>
        new Map(players.map(player => [player, uuid()] as [string, string]))
}
