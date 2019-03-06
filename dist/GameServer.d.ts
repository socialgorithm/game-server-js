/// <reference types="socket.io" />
import { ServerOptions } from "./constants";
import { GameInputBindings } from "./GameServerBindings";
export declare class GameServer {
    private inputBindings;
    private serverOptions?;
    socket: SocketIO.Server;
    constructor(inputBindings: GameInputBindings, serverOptions?: ServerOptions);
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameUpdate: (payload: any) => void;
    sendGameEnd: (payload: any) => void;
}
