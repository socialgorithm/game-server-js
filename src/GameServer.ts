import * as http from "http";
import * as io from "socket.io";

import { Player, ServerOptions, SOCKET_MESSAGE } from "./constants";
import { GameInputBindings } from "./GameServerBindings";

export class GameServer {
    private socket: SocketIO.Server;

    constructor(private inputBindings: GameInputBindings, private serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.socket = io(app);
        const port = serverOptions.port || 3333;

        app.listen(port);

        this.socket.on(SOCKET_MESSAGE.START_GAME, this.inputBindings.startGame);
        this.socket.on(SOCKET_MESSAGE.PLAYER_MESSAGE, this.inputBindings.onPlayerMessage);
    }

    public sendPlayerMessage = (player: Player, payload: any) => {
        this.socket.send(SOCKET_MESSAGE.PLAYER_MESSAGE, {
            payload,
            player,
        });
    }

    public sendGameUpdate = (payload: any) => {
        this.socket.send(SOCKET_MESSAGE.GAME_MESSAGE, {
            payload,
            type: "UPDATE",
        });
    }

    public sendGameEnd = (payload: any) => {
        this.socket.send(SOCKET_MESSAGE.GAME_MESSAGE, {
            payload,
            type: "END",
        });
    }
}
