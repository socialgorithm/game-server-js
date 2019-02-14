import { GameServerBindings, MessageType } from "./constants";
export declare class GameServer {
    private bindings;
    private socket;
    constructor(bindings: GameServerBindings);
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameMessage: (type: MessageType, payload: any) => void;
}
