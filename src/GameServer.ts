// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

import { EventName, Messages, Player } from "@socialgorithm/model";
import * as http from "http";
import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import { IMatch, MatchOutputChannel, NewMatchFn } from "./Match";
import { ServerOptions } from "./ServerOptions";

export class GameServer {
    public io: Server;
    private matches: Map<string, IMatch> = new Map();
    private playerToMatchID: Map<Player, string> = new Map();
    private playerToSocket: Map<Player, Socket> = new Map();

    constructor(private gameInfo: Messages.GameInfoMessage, private newMatchFn: NewMatchFn, serverOptions?: ServerOptions) {
        const httpServer = http.createServer();
        this.io = new Server(httpServer);
        const port = serverOptions.port || 5433;

        httpServer.listen(port);
        // tslint:disable-next-line:no-console
        console.log(`Started Socialgorithm Game Server on ${port}`);
        debug(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: Socket) => {
            if (socket.handshake.query && socket.handshake.query.token) {
                this.onPlayerConnected(socket);
            } else {
                this.onTournamentServerConnected(socket);
            }
        });
    }

    private onTournamentServerConnected = (tournamentServerMatchSocket: Socket) => {
        tournamentServerMatchSocket.emit(EventName.GameInfo, this.gameInfo);
        tournamentServerMatchSocket.on(EventName.CreateMatch, this.createMatch(tournamentServerMatchSocket));
    }

    private onPlayerConnected = (playerSocket: Socket) => {
        debug("New player connection %O", playerSocket.handshake.query);
        // This is a uabc/player connection
        const maybeToken = playerSocket.handshake.query.token;
        const token = Array.isArray(maybeToken) ? maybeToken[0] : maybeToken;
        this.playerToSocket.set(token, playerSocket);
        playerSocket.on(EventName.Game__Player, this.sendPlayerMessageToGame(token));

        // If all players in a match are connected, start the match
        const matchIDThePlayerIsIn = this.playerToMatchID.get(token);
        if (matchIDThePlayerIsIn && this.matches.has(matchIDThePlayerIsIn)) {
            const matchThePlayerIsIn = this.matches.get(matchIDThePlayerIsIn);
            matchThePlayerIsIn.onPlayerConnected(token);
            if (this.allPlayersReady(matchThePlayerIsIn.players)) {
               debug(`All players ready in ${matchIDThePlayerIsIn} - starting match`);
               this.matches.get(matchIDThePlayerIsIn).start();
            }
        } else {
            debug(`Player ${token} is connecting to match ${matchIDThePlayerIsIn}, which doesn't exist`);
        }

        playerSocket.on("disconnect", () => {
            this.onPlayerDisconnected(token);
        });
    }

    private allPlayersReady = (requiredPlayers: Player[]) => {
        debug("Required players: %O", requiredPlayers);
        return requiredPlayers.every(requiredPlayer => {
            return this.playerToSocket.has(requiredPlayer) && this.playerToSocket.get(requiredPlayer).connected;
        });
    }

    private onPlayerDisconnected = (token: string) => {
        debug(`Player ${token} disconnected, removing`);
        const matchIDThePlayerIsIn = this.playerToMatchID.get(token);
        if (matchIDThePlayerIsIn && this.matches.has(matchIDThePlayerIsIn)) {
            const matchThePlayerIsIn = this.matches.get(matchIDThePlayerIsIn);
            matchThePlayerIsIn.onPlayerDisconnected(token);
        }
        this.playerToSocket.delete(token);
    }

    private createMatch = (tournamentServerMatchSocket: Socket) => (message: Messages.CreateMatchMessage) => {
        debug("Received create match message %O", message);
        const playerTokens = this.generateMatchTokens(message.players);
        message.players = message.players.map(player => playerTokens[player]);

        const matchID = uuid();
        const matchOutputChannel: MatchOutputChannel = {
            sendGameEnded: this.sendGameEnded(tournamentServerMatchSocket),
            sendMatchEnded: this.removeMatchAndSendMatchEnded(matchID, tournamentServerMatchSocket),
            sendMessageToPlayer: this.sendGameMessageToPlayer,
        };

        this.matches.set(matchID, this.newMatchFn(message, matchOutputChannel));
        message.players.forEach(player => {
            this.playerToMatchID.set(player, matchID);
        });

        tournamentServerMatchSocket.emit(EventName.MatchCreated, { playerTokens });
    }

    private removeMatchAndSendMatchEnded = (matchID: string, tournamentServerMatchSocket: Socket) => (matchEndedMessage: Messages.MatchEndedMessage) => {
        debug(`Match ${matchID} ended, removing and sending MatchEnded`);

        if (this.matches.has(matchID)) {
            this.matches.get(matchID).players.forEach(player => this.playerToMatchID.delete(player));
            this.matches.delete(matchID);
        }

        tournamentServerMatchSocket.emit(EventName.MatchEnded, matchEndedMessage);
    }

    private sendGameEnded = (tournamentServerSocket: Socket) => (gameEndedMessage: Messages.GameEndedMessage) => {
        tournamentServerSocket.emit(EventName.GameEnded, gameEndedMessage);
    }

    private sendGameMessageToPlayer = (player: Player, payload: any) => {
        if (!this.playerToSocket.has(player)) {
            debug(`Socket not found for player ${player}, cannot send game message`);
            return;
        }

        this.playerToSocket.get(player).emit(EventName.Game__Player, { payload });
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

}
