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
            _this.io.emit(constants_1.SOCKET_MESSAGE.GAME__PLAYER, {
                payload: payload,
                player: player
            });
        };
        this.sendGameUpdate = function (payload) {
            _this.io.emit(constants_1.SOCKET_MESSAGE.UPDATE, {
                payload: payload
            });
        };
        this.sendGameEnd = function (payload) {
            _this.io.emit(constants_1.SOCKET_MESSAGE.GAME_ENDED, {
                payload: payload
            });
        };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 3333;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (socket) {
            socket.on(constants_1.SOCKET_MESSAGE.START_GAME, _this.inputBindings.startGame);
            socket.on(constants_1.SOCKET_MESSAGE.GAME__PLAYER, _this.inputBindings.onPlayerMessage);
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map