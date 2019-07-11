import { Player } from ".";

export type GameInfoMessage = {
  name: string,
};

export type GameStartMessage = {
  gameID: string,
  players: Player[],
};

export type GameStartedMessage = {
  playerGameTokens: {
    [name: string]: string,
  },
};

export type GameServerHandoffMessage = {
  gameServerAddress: string,
  gameID: string,
  token: string,
};

export type PlayerToGameMessage = {
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
