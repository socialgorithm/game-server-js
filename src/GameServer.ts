import { GameServerBindings, Player, MessageType } from "./constants";

export class GameServer {
    private socket: any;

    constructor(private bindings: GameServerBindings) {
        // TODO Use a real socket
        this.socket = {};

        this.socket.on('startGame', this.bindings.startGame);
        this.socket.on('playerMessage', this.bindings.onPlayerMessage);

    }

    public sendPlayerMessage = (player: Player, payload: any) => {
        this.socket.send(player, payload);
    };

    public sendGameMessage = (type: MessageType, payload: any) => {
        this.socket.send(type, payload);
    };
}