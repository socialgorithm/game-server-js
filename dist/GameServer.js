"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var model_1 = require("@socialgorithm/model");
var http = require("http");
var io = require("socket.io");
var uuid_1 = require("uuid");
var debug = require("debug")("sg:gameServer");
var GameServer = (function () {
    function GameServer(gameInfo, newGameFn, serverOptions) {
        var _this = this;
        this.newGameFn = newGameFn;
        this.sendGameMessageToPlayer = function (player, payload) {
            if (!_this.playerToSocket.has(player)) {
                debug("Socket not found for player " + player + ", cannot send game message");
                return;
            }
            _this.playerToSocket.get(player).emit(model_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, payload);
        };
        this.sendGameUpdated = function (socket, gameID) { return function (payload) {
            var gameUpdatedMessage = {
                payload: payload
            };
            socket.emit(model_1.GAME_SOCKET_MESSAGE.GAME_UPDATED, __assign({ gameID: gameID }, gameUpdatedMessage));
        }; };
        this.sendGameEnded = function (socket, gameID) { return function (gameEndedMessage) {
            socket.emit(model_1.GAME_SOCKET_MESSAGE.GAME_ENDED, __assign({ gameID: gameID }, gameEndedMessage));
        }; };
        this.startGame = function (socket, gameStartMessage) {
            var playerGameTokens = _this.generateGameTokens(gameStartMessage.players);
            gameStartMessage.players = gameStartMessage.players.map(function (player) { return playerGameTokens.get(player); });
            var gameOutputChannel = {
                sendGameEnd: _this.sendGameEnded(socket, gameStartMessage.gameID),
                sendGameUpdate: _this.sendGameUpdated(socket, gameStartMessage.gameID),
                sendPlayerMessage: _this.sendGameMessageToPlayer
            };
            _this.games.set(gameStartMessage.gameID, _this.newGameFn(gameStartMessage, gameOutputChannel));
            gameStartMessage.players.forEach(function (player) {
                _this.playerToGameID.set(player, gameStartMessage.gameID);
            });
            socket.emit(model_1.GAME_SOCKET_MESSAGE.GAME_STARTED, { playerGameTokens: playerGameTokens });
        };
        this.sendPlayerMessageToGame = function (player) { return function (payload) {
            if (!_this.playerToGameID.has(player)) {
                debug("Player " + player + " does not have an associated game, cannot send player's message");
                return;
            }
            var gameId = _this.playerToGameID.get(player);
            if (!_this.games.has(gameId)) {
                debug("Game " + gameId + " not found, cannot send player " + player + "'s message");
            }
            _this.games.get(gameId).onPlayerMessage(player, payload);
        }; };
        this.generateGameTokens = function (players) {
            return new Map(players.map(function (player) { return [player, uuid_1.v4()]; }));
        };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 5433;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        debug("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (socket) {
            socket.emit(model_1.GAME_SOCKET_MESSAGE.GAME_INFO, gameInfo);
            if (socket.handshake.query && socket.handshake.query.token) {
                var token = socket.handshake.query.token;
                _this.playerToSocket.set(token, socket);
                socket.on(model_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, _this.sendPlayerMessageToGame(token));
            }
            socket.on(model_1.GAME_SOCKET_MESSAGE.START_GAME, _this.startGame);
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map