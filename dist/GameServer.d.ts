import * as io from "socket.io";
import { NewGameFn } from "./Game";
import { GameEndedMessage, GameInfoMessage } from "./GameMessage";
import { ServerOptions } from "./ServerOptions";
export declare class GameServer {
    io: SocketIO.Server;
    constructor(gameInfo: GameInfoMessage, newGameFn: NewGameFn, serverOptions?: ServerOptions);
    sendPlayerMessage: (socket: io.Socket) => (player: string, payload: any) => void;
    sendGameUpdated: (socket: io.Socket) => (payload: any) => void;
    sendGameEnded: (socket: io.Socket) => (gameEndedMessage: GameEndedMessage) => void;
    private unimplementedWarning;
}
