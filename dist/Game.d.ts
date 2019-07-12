import { GameMessage } from "@socialgorithm/model";
export declare type NewGameFn = (createGameMessage: GameMessage.CreateGameMessage, gameOutputChannel: GameOutputChannel) => Game;
export interface Game {
    start(): void;
    onPlayerMessage(player: Player, payload: any): void;
}
export declare type GameAndPlayers = {
    game: Game;
    players: Player[];
};
export declare type GameOutputChannel = {
    sendPlayerMessage: (player: string, payload: any) => void;
    sendGameUpdate: (payload: any) => void;
    sendGameEnd: (payload: any) => void;
};
export declare type Player = string;
