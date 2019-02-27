export declare type Player = string;
export declare type MessageType = "END" | "UPDATE";
export declare type ServerOptions = {
    port: number;
};
export declare type GameOptions = {};
export declare type GameUpdatePayload = {
    stats: any;
};
export declare type GameEndPayload = {
    winner: Player | null;
    tie: boolean;
    duration: number;
    stats: any;
    message: string;
};
export declare type GameMessage = {
    type: MessageType;
    payload: any;
};
export declare const SOCKET_MESSAGE: {
    GAME_MESSAGE: string;
    PLAYER_MESSAGE: string;
    START_GAME: string;
};
