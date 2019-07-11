import { GameMessage } from "@socialgorithm/model";

export type NewGameFn = (gameStartMessage: GameMessage.GameStartMessage, gameOutputChannel: GameOutputChannel) => Game;

export interface Game {
  onPlayerMessage(player: Player, payload: any): void;
}

export type GameOutputChannel = {
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};

export type Player = string;
