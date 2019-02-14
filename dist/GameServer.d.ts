import { GameServerBindings, MessageType, ServerOptions } from "./constants";
export declare class GameServer {
    private serverOptions;
    private bindings;
    private socket;
    constructor(serverOptions: ServerOptions, bindings: GameServerBindings);
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameMessage: (type: MessageType, payload: any) => void;
}
