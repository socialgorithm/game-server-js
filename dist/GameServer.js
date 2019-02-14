"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var constants_1 = require("./constants");
var GameServer = (function () {
    function GameServer(serverOptions, bindings) {
        var _this = this;
        this.serverOptions = serverOptions;
        this.bindings = bindings;
        this.sendPlayerMessage = function (player, payload) {
            _this.socket.send(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, {
                player: player,
                payload: payload
            });
        };
        this.sendGameMessage = function (type, payload) {
            _this.socket.send(constants_1.SOCKET_MESSAGE.GAME_MESSAGE, {
                type: type,
                payload: payload
            });
        };
        var app = http.createServer();
        this.socket = io(app);
        var port = serverOptions.port || 3333;
        app.listen(port);
        console.log('Socialgorithm Game Server Started');
        console.log('Running in port ', port);
        this.socket.on(constants_1.SOCKET_MESSAGE.START_GAME, this.bindings.startGame);
        this.socket.on(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, this.bindings.onPlayerMessage);
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map