import { Player } from ".";
import { GameStartMessage } from "./GameMessage";

export type NewGameFn = (gameStartMessage: GameStartMessage, gameOutputChannel: GameOutputChannel) => Game;

export abstract class Game {
  public abstract onPlayerMessage(player: Player, payload: any): void;
}

export type GameOutputChannel = {
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};

export type Player = string;
