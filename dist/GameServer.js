"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var constants_1 = require("./constants");
var GameServer = (function () {
    function GameServer(inputBindings, serverOptions) {
        var _this = this;
        this.inputBindings = inputBindings;
        this.serverOptions = serverOptions;
        this.sendPlayerMessage = function (player, payload) {
            _this.socket.send(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, {
                payload: payload,
                player: player
            });
        };
        this.sendGameUpdate = function (payload) {
            _this.socket.send(constants_1.SOCKET_MESSAGE.GAME_MESSAGE, {
                payload: payload,
                type: "UPDATE"
            });
        };
        this.sendGameEnd = function (payload) {
            _this.socket.send(constants_1.SOCKET_MESSAGE.GAME_MESSAGE, {
                payload: payload,
                type: "END"
            });
        };
        var app = http.createServer();
        this.socket = io(app);
        var port = serverOptions.port || 3333;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        this.socket.on(constants_1.SOCKET_MESSAGE.START_GAME, this.inputBindings.startGame);
        this.socket.on(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, this.inputBindings.onPlayerMessage);
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map