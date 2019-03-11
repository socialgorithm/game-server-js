"use strict";
exports.__esModule = true;
var http = require("http");
var io = require("socket.io");
var GameSocketMessage_1 = require("./GameSocketMessage");
var debug = require("debug")("sg:gameServer");
var GameServer = (function () {
    function GameServer(gameInfo, newGameFn, serverOptions) {
        var _this = this;
        this.sendPlayerMessage = function (socket) { return function (player, payload) {
            var gameToPlayerMessage = {
                payload: payload,
                player: player
            };
            socket.emit(GameSocketMessage_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, gameToPlayerMessage);
        }; };
        this.sendGameUpdated = function (socket) { return function (payload) {
            var gameUpdatedMessage = {
                payload: payload
            };
            socket.emit(GameSocketMessage_1.GAME_SOCKET_MESSAGE.GAME_UPDATED, gameUpdatedMessage);
        }; };
        this.sendGameEnded = function (socket) { return function (gameEndedMessage) {
            socket.emit(GameSocketMessage_1.GAME_SOCKET_MESSAGE.GAME_ENDED, gameEndedMessage);
        }; };
        this.unimplementedWarning = function (fn) { return function () {
            console.log("Game Server Error: Please provide an implementation for " + fn);
        }; };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 5433;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        debug("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (socket) {
            socket.emit(GameSocketMessage_1.GAME_SOCKET_MESSAGE.GAME_INFO, gameInfo);
            socket.on(GameSocketMessage_1.GAME_SOCKET_MESSAGE.START_GAME, function (gameStartMessage) {
                var gameOutputChannel = {
                    sendGameEnd: _this.sendGameEnded(socket),
                    sendGameUpdate: _this.sendGameUpdated(socket),
                    sendPlayerMessage: _this.sendPlayerMessage(socket)
                };
                var game = newGameFn(gameStartMessage, gameOutputChannel);
                socket.on(GameSocketMessage_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, function (playerToGameMessage) {
                    game.onPlayerMessage(playerToGameMessage.player, playerToGameMessage.payload);
                });
            });
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map