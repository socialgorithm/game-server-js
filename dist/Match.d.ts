import { Messages, Player } from "@socialgorithm/model";
export declare type NewMatchFn = (createMatchMessage: Messages.CreateMatchMessage, matchOutputChannel: MatchOutputChannel) => IMatch;
export interface IMatch {
    players: Player[];
    start(): void;
    onMessageFromPlayer(player: Player, payload: Messages.PlayerToGameMessage): void;
}
export declare type MatchOutputChannel = {
    sendMessageToPlayer: (player: string, payload: Messages.GameToPlayerMessage) => void;
    sendGameEnded: (message: Messages.GameEndedMessage) => void;
    sendMatchEnded: (message: Messages.MatchEndedMessage) => void;
};
