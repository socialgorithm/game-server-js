import { Messages, Player } from "@socialgorithm/model";
export declare type NewMatchFn = (createMatchMessage: Messages.CreateMatchMessage, matchOutputChannel: MatchOutputChannel) => IMatch;
export interface IMatch {
    players: Player[];
    onPlayerConnected(player: Player): void;
    onPlayerDisconnected(player: Player): void;
    start(): void;
    onMessageFromPlayer(player: Player, message: any): void;
}
export declare type MatchOutputChannel = {
    sendMessageToPlayer: (player: string, message: any) => void;
    sendGameEnded: (message: Messages.GameEndedMessage) => void;
    sendMatchEnded: (message?: Messages.MatchEndedMessage) => void;
};
