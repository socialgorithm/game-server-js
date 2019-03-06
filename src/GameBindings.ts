import { GameOptions, Player } from "./constants";

type OnStartGame = (players: Player[], options: GameOptions) => void;
type OnPlayerMessage = (players: Player[], options: GameOptions) => void;

export type GameBindings = {
  onStartGame: (fn: OnStartGame) => void;
  onPlayerMessage: (fn: OnPlayerMessage) => void;
  sendPlayerMessage: (player: string, payload: any) => void;
  sendGameUpdate: (payload: any) => void;
  sendGameEnd: (payload: any) => void;
};
