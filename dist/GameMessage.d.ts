import { Player } from ".";
export declare type GameInfoMessage = {
    name: string;
};
export declare type GameStartMessage = {
    players: Player[];
};
export declare type PlayerToGameMessage = {
    player: Player;
    payload: any;
};
export declare type GameToPlayerMessage = PlayerToGameMessage;
export declare type GameUpdatedMessage = {
    payload: any;
};
export declare type GameEndedMessage = {
    winner: Player | null;
    tie: boolean;
    duration: number;
    payload: any;
    message: string;
};
