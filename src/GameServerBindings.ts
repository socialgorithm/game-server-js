import { GameOptions, Player } from "./constants";

export type GameInputBindings = {
  startGame: (players: Player[], options: GameOptions) => { id: string };
  onPlayerMessage: (gameId: string, player: Player, payload: any) => void;
};

export type GameOutputBindings = {
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};
