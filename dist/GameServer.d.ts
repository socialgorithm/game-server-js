import { GameMessage } from "@socialgorithm/model";
import * as io from "socket.io";
import { NewGameFn } from "./Game";
import { ServerOptions } from "./ServerOptions";
export declare class GameServer {
    private newGameFn;
    io: SocketIO.Server;
    private games;
    private playerToGameID;
    private playerToSocket;
    constructor(gameInfo: GameMessage.GameInfoMessage, newGameFn: NewGameFn, serverOptions?: ServerOptions);
    sendGameMessageToPlayer: (player: string, payload: any) => void;
    sendGameUpdated: (socket: io.Socket, gameID: string) => (payload: any) => void;
    sendGameEnded: (socket: io.Socket, gameID: string) => (gameEndedMessage: GameMessage.GameEndedMessage) => void;
    private createGame;
    private sendPlayerMessageToGame;
    private generateGameTokens;
    private allPlayersReady;
}
