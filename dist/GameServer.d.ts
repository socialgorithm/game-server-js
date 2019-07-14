/// <reference types="socket.io" />
import { Messages, Socket } from "@socialgorithm/model";
import { NewMatchFn } from "./Match";
import { ServerOptions } from "./ServerOptions";
export declare class GameServer {
    private newMatchFn;
    io: SocketIO.Server;
    private matches;
    private playerToMatchID;
    private playerToSocket;
    constructor(gameInfo: Messages.GameInfoMessage, newMatchFn: NewMatchFn, serverOptions?: ServerOptions);
    sendGameMessageToPlayer: (player: string, payload: any) => void;
    sendMatchEnded: (socket: Socket) => (matchEndedMessage: Messages.MatchEndedMessage) => void;
    sendGameEnded: (socket: Socket) => (gameEndedMessage: import("@socialgorithm/model").Game) => void;
    private createMatch;
    private sendPlayerMessageToGame;
    private generateMatchTokens;
    private allPlayersReady;
}
