import { Player } from ".";

export type GameInfoMessage = {
  name: string,
};

export type GameStartMessage = {
  players: Player[],
};

export type PlayerToGameMessage = {
  player: Player,
  payload: any,
};

export type GameToPlayerMessage = PlayerToGameMessage;

export type GameUpdatedMessage = {
  payload: any,
};

export type GameEndedMessage = {
  winner: Player | null,
  tie: boolean,
  duration: number,
  payload: any,
  message: string,
};
