import * as http from "http";
import * as io from "socket.io";

import { Player, ServerOptions, SOCKET_MESSAGE } from "./constants";
import { GameInputBindings } from "./GameServerBindings";

export class GameServer {
    public io: SocketIO.Server;

    constructor(private inputBindings: GameInputBindings, private serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.io = io(app);
        const port = serverOptions.port || 3333;

        app.listen(port);
        // tslint:disable-next-line:no-console
        console.log(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: io.Socket) => {
            socket.on(SOCKET_MESSAGE.START_GAME, this.inputBindings.startGame);
            socket.on(SOCKET_MESSAGE.GAME__PLAYER, this.inputBindings.onPlayerMessage);
        });
    }

    public sendPlayerMessage = (player: Player, payload: any) => {
        this.io.emit(SOCKET_MESSAGE.GAME__PLAYER, {
            payload,
            player,
        });
    }

    public sendGameUpdate = (payload: any) => {
        this.io.emit(SOCKET_MESSAGE.UPDATE, {
            payload,
        });
    }

    public sendGameEnd = (payload: any) => {
        this.io.emit(SOCKET_MESSAGE.GAME_ENDED, {
            payload,
        });
    }
}
