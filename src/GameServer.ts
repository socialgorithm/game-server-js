import * as http from "http";
import * as io from "socket.io";

import { GameServerBindings, Player, MessageType, ServerOptions, SOCKET_MESSAGE } from "./constants";

export class GameServer {
    private socket: SocketIO.Server;

    constructor(private serverOptions: ServerOptions, private bindings: GameServerBindings) {
        const app = http.createServer();
        this.socket = io(app);
        const port = serverOptions.port || 3333;

        app.listen(port);

        console.log('Socialgorithm Game Server Started');
        console.log('Running in port ', port);

        this.socket.on(SOCKET_MESSAGE.START_GAME, this.bindings.startGame);
        this.socket.on(SOCKET_MESSAGE.PLAYER_MESSAGE, this.bindings.onPlayerMessage);
    }

    public sendPlayerMessage = (player: Player, payload: any) => {
        this.socket.send(SOCKET_MESSAGE.PLAYER_MESSAGE, {
            player,
            payload,
        });
    };

    public sendGameMessage = (type: MessageType, payload: any) => {
        this.socket.send(SOCKET_MESSAGE.GAME_MESSAGE, {
            type,
            payload,
        });
    };
}