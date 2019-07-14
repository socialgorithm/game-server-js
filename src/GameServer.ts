import { Events, Handlers, Messages, Player } from "@socialgorithm/model";
import { EventName } from "@socialgorithm/model/dist/Events";
import * as http from "http";
import * as io from "socket.io";
import { v4 as uuid } from "uuid";
import { IMatch, MatchOutputChannel, NewMatchFn } from "./Match";
import { ServerOptions } from "./ServerOptions";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

export class GameServer {
    public io: SocketIO.Server;
    private matches: Map<string, IMatch> = new Map();
    private playerToMatchID: Map<Player, string> = new Map();
    private playerToSocket: Map<Player, io.Socket> = new Map();

    constructor(gameInfo: Messages.GameInfoMessage, private newMatchFn: NewMatchFn, serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.io = io(app);
        const port = serverOptions.port || 5433;

        app.listen(port);
        // tslint:disable-next-line:no-console
        console.log(`Started Socialgorithm Game Server on ${port}`);
        debug(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: io.Socket) => {
            // Use a wrapper for type-safety
            socket.emit(EventName.GameInfo, gameInfo);

            if (socket.handshake.query && socket.handshake.query.token) {
                // This is a uabc/player connection
                const token = socket.handshake.query.token;
                this.playerToSocket.set(token, socket);
                socket.on(EventName.Game__Player, this.sendPlayerMessageToGame(token));

                // If all players in a match are connected, start the match
                const playersMatch = this.playerToMatchID.get(token);
                if (playersMatch && this.allPlayersReady(playersMatch)) {
                    this.matches.get(playersMatch).start();
                }
            } else {
                // Otherwise, it's a tournament server connection
                socket.on(EventName.Game__Player, this.createMatch(socket));
            }
        });
    }

    public sendGameMessageToPlayer = (player: Player, payload: any) => {
        if (!this.playerToSocket.has(player)) {
            debug(`Socket not found for player ${player}, cannot send game message`);
            return;
        }

        this.playerToSocket.get(player).emit(EventName.Game__Player, { payload });
    }

    public sendMatchEnded = (socket: io.Socket) => () => {
        socket.emit(EventName.MatchEnded, null);
    }

    public sendGameEnded = (socket: io.Socket) => (gameEndedMessage: Messages.GameEndedMessage) => {
        socket.emit(EventName.GameEnded, gameEndedMessage);
    }

    private createMatch = (socket: io.Socket) => (message: Messages.CreateMatchMessage) => {
        debug("Received create match message %O", message);
        const playerTokens = this.generateMatchTokens(message.players);
        message.players = message.players.map(player => playerTokens[player]);

        const matchID = uuid();
        const matchOutputChannel: MatchOutputChannel = {
            sendGameEnded: this.sendGameEnded(socket),
            sendMatchEnded: this.sendMatchEnded(socket),
            sendMessageToPlayer: this.sendGameMessageToPlayer,
        };

        this.matches.set(matchID, this.newMatchFn(message, matchOutputChannel));

        message.players.forEach(player => {
            this.playerToMatchID.set(player, matchID);
        });

        socket.emit(EventName.MatchCreated, { playerTokens });
    }

    private sendPlayerMessageToGame = (player: Player) => (message: Messages.PlayerToGameMessage) => {
        // Find the game that the player is in, send message
        if (!this.playerToMatchID.has(player)) {
            debug(`Player ${player} does not have an associated game, cannot send player's message`);
            return;
        }
        const matchId = this.playerToMatchID.get(player);

        if (!this.matches.has(matchId)) {
            debug(`Match ${matchId} not found, cannot send player ${player}'s message`);
        }

        this.matches.get(matchId).onMessageFromPlayer(player, message.payload);
    }

    private generateMatchTokens = (players: Player[]) => {
        const gameTokens: { [key: string]: string } = {};
        players.forEach(player => { gameTokens[player] = uuid(); });
        return gameTokens;
    }

    private allPlayersReady = (matchID: string) => {
        const requiredPlayers = this.matches.get(matchID).players;
        const currentPlayers: Player[] = Object.entries(this.playerToMatchID)
            .filter(entry => entry[1] === matchID)
            .map(entry => entry[0]);

        return requiredPlayers.every(requiredPlayer => currentPlayers.includes(requiredPlayer));
    }
}
