import { GameMessage } from "@socialgorithm/model";

export type NewGameFn = (createGameMessage: GameMessage.CreateGameMessage, gameOutputChannel: GameOutputChannel) => Game;

export interface Game {
  start(): void;
  onPlayerMessage(player: Player, payload: any): void;
}

export type GameAndPlayers = {
  game: Game,
  players: Player[],
};

export type GameOutputChannel = {
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};

export type Player = string;
