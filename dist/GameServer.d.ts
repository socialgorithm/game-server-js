import * as io from "socket.io";
import { OnConnection, ServerOptions } from "./constants";
export declare class GameServer {
    private serverOptions?;
    io: SocketIO.Server;
    constructor(onConnection: OnConnection, serverOptions?: ServerOptions);
    sendPlayerMessage: (socket: io.Socket) => (player: string, payload: any) => void;
    sendGameUpdate: (socket: io.Socket) => (payload: any) => void;
    sendGameEnd: (socket: io.Socket) => (payload: any) => void;
    private unimplementedWarning;
}
