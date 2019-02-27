export type Player = string;

export type MessageType = "END" | "UPDATE";

export type ServerOptions = {
    port: number,
};

export type GameOptions = {};

export type GameUpdatePayload = {
    stats: any,
};

export type GameEndPayload = {
    winner: Player | null,
    tie: boolean,
    duration: number,
    stats: any,
    message: string, // optional message for the UI
};

export type GameMessage = {
    type: MessageType,
    payload: any,
};

export const SOCKET_MESSAGE = {
    GAME_MESSAGE: "gameMessage",
    PLAYER_MESSAGE: "playerMessage",
    START_GAME: "startGame",
};
