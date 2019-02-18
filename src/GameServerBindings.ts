import { GameOptions, Player } from './constants';

export type GameServerBindings = {
  startGame: (options: GameOptions) => void;
  onPlayerMessage: (player: Player, payload: any) => void;
};