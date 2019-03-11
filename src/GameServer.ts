import * as http from "http";
import * as io from "socket.io";
import { GameOutputChannel, NewGameFn, Player } from "./Game";
import { GameEndedMessage, GameInfoMessage, GameStartMessage, GameToPlayerMessage, GameUpdatedMessage, PlayerToGameMessage } from "./GameMessage";
import { GAME_SOCKET_MESSAGE } from "./GameSocketMessage";
import { ServerOptions } from "./ServerOptions";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServer");

export class GameServer {
    public io: SocketIO.Server;

    constructor(gameInfo: GameInfoMessage, newGameFn: NewGameFn, serverOptions?: ServerOptions) {
        const app = http.createServer();
        this.io = io(app);
        const port = serverOptions.port || 5433;

        app.listen(port);
        // tslint:disable-next-line:no-console
        console.log(`Started Socialgorithm Game Server on ${port}`);
        debug(`Started Socialgorithm Game Server on ${port}`);

        this.io.on("connection", (socket: io.Socket) => {
            socket.emit(GAME_SOCKET_MESSAGE.GAME_INFO, gameInfo);

            socket.on(GAME_SOCKET_MESSAGE.START_GAME, (gameStartMessage: GameStartMessage) => {

                const gameOutputChannel: GameOutputChannel = {
                    sendGameEnd: this.sendGameEnded(socket),
                    sendGameUpdate: this.sendGameUpdated(socket),
                    sendPlayerMessage: this.sendPlayerMessage(socket),
                };

                const game = newGameFn(gameStartMessage, gameOutputChannel);

                socket.on(GAME_SOCKET_MESSAGE.GAME__PLAYER, (playerToGameMessage: PlayerToGameMessage) => {
                    game.onPlayerMessage(playerToGameMessage.player, playerToGameMessage.payload);
                });
            });

        });

    }

    public sendPlayerMessage = (socket: io.Socket) => (player: Player, payload: any) => {
        const gameToPlayerMessage: GameToPlayerMessage = {
            payload,
            player,
        };
        socket.emit(GAME_SOCKET_MESSAGE.GAME__PLAYER, gameToPlayerMessage);
    }

    public sendGameUpdated = (socket: io.Socket) => (payload: any) => {
        const gameUpdatedMessage: GameUpdatedMessage = {
            payload,
        };
        socket.emit(GAME_SOCKET_MESSAGE.GAME_UPDATED, gameUpdatedMessage);
    }

    public sendGameEnded = (socket: io.Socket) => (gameEndedMessage: GameEndedMessage) => {
        socket.emit(GAME_SOCKET_MESSAGE.GAME_ENDED, gameEndedMessage);
    }

    private unimplementedWarning = (fn: string) => () => {
        // tslint:disable-next-line:no-console
        console.log(`Game Server Error: Please provide an implementation for ${fn}`);
    }
}
