import { Messages, Player } from "@socialgorithm/model";

export type NewMatchFn = (createMatchMessage: Messages.CreateMatchMessage, matchOutputChannel: MatchOutputChannel) => IMatch;

export interface IMatch {
  players: Player[];
  start(): void;
  onMessageFromPlayer(player: Player, message: any): void;
}

export type MatchOutputChannel = {
  sendMessageToPlayer: (player: string, message: any) => void;
  sendGameEnded: (message: Messages.GameEndedMessage) => void;
  sendMatchEnded: () => void;
};
