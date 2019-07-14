import { Messages, Player } from "@socialgorithm/model";

export type NewMatchFn = (createMatchMessage: Messages.CreateMatchMessage, matchOutputChannel: MatchOutputChannel) => IMatch;

export interface IMatch {
  players: Player[];
  start(): void;
  onMessageFromPlayer(player: Player, payload: Messages.PlayerToGameMessage): void;
}

export type MatchOutputChannel = {
  sendMessageToPlayer: (player: string, payload: Messages.GameToPlayerMessage) => void;
  sendGameEnded: (message: Messages.GameEndedMessage) => void;
  sendMatchEnded: (message: Messages.MatchEndedMessage) => void;
};
