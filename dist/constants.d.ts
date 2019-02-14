export declare type Player = string;
export declare type MessageType = "END" | "UPDATE";
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
export declare type GameServerBindings = {
    startGame: (options: GameOptions) => void;
    onPlayerMessage: (player: Player, payload: any) => void;
};
