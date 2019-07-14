import { Messages } from "@socialgorithm/model";
import * as io from "socket.io";
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
    sendMatchEnded: (socket: io.Socket) => () => void;
    sendGameEnded: (socket: io.Socket) => (gameEndedMessage: import("@socialgorithm/model").Game) => void;
    private createMatch;
    private sendPlayerMessageToGame;
    private generateMatchTokens;
    private allPlayersReady;
}
