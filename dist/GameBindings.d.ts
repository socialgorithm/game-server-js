import { GameOptions, Player } from "./constants";
declare type OnStartGame = (players: Player[], options: GameOptions) => void;
declare type OnPlayerMessage = (player: Player, payload: any) => void;
export declare type GameBindings = {
    onStartGame: (fn: OnStartGame) => void;
    onPlayerMessage: (fn: OnPlayerMessage) => void;
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameUpdate: (payload: any) => void;
    sendGameEnd: (payload: any) => void;
};
export {};
