import * as http from "http";
import * as io from "socket.io";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

import { OnConnection, Player, ServerOptions, SOCKET_MESSAGE } from "./constants";
import { GameBindings } from "./GameBindings";

export class GameServer {
    public io: SocketIO.Server;

    constructor(onConnection: OnConnection, private serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.io = io(app);
        const port = serverOptions.port || 3333;

        app.listen(port);
        // tslint:disable-next-line:no-console
        debug(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: io.Socket) => {
            // we have the socket
            const inputBindings: any = {
                onPlayerMessage: this.unimplementedWarning("onPlayerMessage"),
                onStartGame: this.unimplementedWarning("onStartGame"),
            };

            debug("New connection");

            const bindings: GameBindings = {
                // Game Server -> Game Implementation
                onPlayerMessage: (onPlayerMessage: any) => {
                    inputBindings.onPlayerMessage = onPlayerMessage;
                },
                onStartGame: (onStartGame: any) => {
                    inputBindings.onStartGame = onStartGame;
                },
                // Implementation -> Game Server
                sendGameEnd: this.sendGameEnd(socket),
                sendGameUpdate: this.sendGameUpdate(socket),
                sendPlayerMessage: this.sendPlayerMessage(socket),
            };

            onConnection(bindings);

            socket.on(SOCKET_MESSAGE.START_GAME, (data: any) => {
                inputBindings.onStartGame(data);
            });
            socket.on(SOCKET_MESSAGE.GAME__PLAYER, (data: any) => {
                inputBindings.onPlayerMessage(data.player, data.payload);
            });
        });
    }

    public sendPlayerMessage = (socket: io.Socket) => (player: Player, payload: any) => {
        socket.emit(SOCKET_MESSAGE.GAME__PLAYER, {
            payload,
            player,
        });
    }

    public sendGameUpdate = (socket: io.Socket) => (payload: any) => {
        socket.emit(SOCKET_MESSAGE.UPDATE, {
            payload,
        });
    }

    public sendGameEnd = (socket: io.Socket) => (payload: any) => {
        socket.emit(SOCKET_MESSAGE.GAME_ENDED, {
            payload,
        });
    }

    private unimplementedWarning = (fn: string) => () => {
        // tslint:disable-next-line:no-console
        console.log(`Game Server Error: Please provide an implementation for ${fn}`);
    }
}
