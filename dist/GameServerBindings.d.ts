import { GameOptions, Player } from "./constants";
export declare type GameInputBindings = {
    startGame: (players: Player[], options: GameOptions) => {
        id: string;
    };
    onPlayerMessage: (gameId: string, player: Player, payload: any) => void;
};
export declare type GameOutputBindings = {
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameUpdate: (payload: any) => void;
    sendGameEnd: (payload: any) => void;
};
