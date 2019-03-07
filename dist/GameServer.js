"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var debug = require("debug")("sg:gameServer");
var constants_1 = require("./constants");
var GameServer = (function () {
    function GameServer(onConnection, serverOptions) {
        var _this = this;
        this.serverOptions = serverOptions;
        this.sendPlayerMessage = function (socket) { return function (player, payload) {
            socket.emit(constants_1.SOCKET_MESSAGE.GAME__PLAYER, {
                payload: payload,
                player: player
            });
        }; };
        this.sendGameUpdate = function (socket) { return function (payload) {
            socket.emit(constants_1.SOCKET_MESSAGE.UPDATE, {
                payload: payload
            });
        }; };
        this.sendGameEnd = function (socket) { return function (payload) {
            socket.emit(constants_1.SOCKET_MESSAGE.GAME_ENDED, {
                payload: payload
            });
        }; };
        this.unimplementedWarning = function (fn) { return function () {
            console.log("Game Server Error: Please provide an implementation for " + fn);
        }; };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 3333;
        app.listen(port);
        debug("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (socket) {
            var inputBindings = {
                onPlayerMessage: _this.unimplementedWarning("onPlayerMessage"),
                onStartGame: _this.unimplementedWarning("onStartGame")
            };
            debug("New connection");
            var bindings = {
                onPlayerMessage: function (onPlayerMessage) {
                    inputBindings.onPlayerMessage = onPlayerMessage;
                },
                onStartGame: function (onStartGame) {
                    inputBindings.onStartGame = onStartGame;
                },
                sendGameEnd: _this.sendGameEnd(socket),
                sendGameUpdate: _this.sendGameUpdate(socket),
                sendPlayerMessage: _this.sendPlayerMessage(socket)
            };
            onConnection(bindings);
            socket.on(constants_1.SOCKET_MESSAGE.START_GAME, function (data) {
                inputBindings.onStartGame(data);
            });
            socket.on(constants_1.SOCKET_MESSAGE.GAME__PLAYER, function (data) {
                inputBindings.onPlayerMessage(data.player, data.payload);
            });
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map