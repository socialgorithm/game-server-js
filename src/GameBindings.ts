import { GameOptions, Player } from "./constants";

export type GameBindings = {
  onStartGame: (players: Player[], options: GameOptions) => void;
  onPlayerMessage: (player: Player, payload: any) => void;
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};
