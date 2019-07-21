/// <reference types="socket.io" />
import { Messages } from "@socialgorithm/model";
import { NewMatchFn } from "./Match";
import { ServerOptions } from "./ServerOptions";
export declare class GameServer {
    private gameInfo;
    private newMatchFn;
    io: SocketIO.Server;
    private matches;
    private playerToMatchID;
    private playerToSocket;
    constructor(gameInfo: Messages.GameInfoMessage, newMatchFn: NewMatchFn, serverOptions?: ServerOptions);
    private onTournamentServerConnected;
    private onPlayerConnected;
    private allPlayersReady;
    private onPlayerDisconnected;
    private createMatch;
    private removeMatchAndSendMatchEnded;
    private sendGameEnded;
    private sendGameMessageToPlayer;
    private sendPlayerMessageToGame;
    private generateMatchTokens;
}
