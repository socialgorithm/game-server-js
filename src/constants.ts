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

export type GameServerBindings = {
    startGame: (options: GameOptions) => void;
    onPlayerMessage: (player: Player, payload: any) => void;
};

export const SOCKET_MESSAGE = {
    START_GAME: 'startGame',
    PLAYER_MESSAGE: 'playerMessage',
    GAME_MESSAGE: 'gameMessage',
};