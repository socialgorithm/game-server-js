import { Player } from ".";
import { GameStartMessage } from "./GameMessage";
export declare type NewGameFn = (gameStartMessage: GameStartMessage, gameOutputChannel: GameOutputChannel) => Game;
export declare abstract class Game {
    abstract onPlayerMessage(player: Player, payload: any): void;
}
export declare type GameOutputChannel = {
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameUpdate: (payload: any) => void;
    sendGameEnd: (payload: any) => void;
};
export declare type Player = string;
