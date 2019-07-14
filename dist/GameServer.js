"use strict";
exports.__esModule = true;
var model_1 = require("@socialgorithm/model");
var http = require("http");
var io = require("socket.io");
var uuid_1 = require("uuid");
var debug = require("debug")("sg:gameServer");
var GameServer = (function () {
    function GameServer(gameInfo, newMatchFn, serverOptions) {
        var _this = this;
        this.newMatchFn = newMatchFn;
        this.matches = new Map();
        this.playerToMatchID = new Map();
        this.playerToSocket = new Map();
        this.sendGameMessageToPlayer = function (player, payload) {
            if (!_this.playerToSocket.has(player)) {
                debug("Socket not found for player " + player + ", cannot send game message");
                return;
            }
            _this.playerToSocket.get(player).emit(new model_1.Events.GameToPlayerEvent({ payload: payload }));
        };
        this.sendMatchEnded = function (socket) { return function () {
            socket.emit(new model_1.Events.MatchEndedEvent());
        }; };
        this.sendGameEnded = function (socket) { return function (gameEndedMessage) {
            socket.emit(new model_1.Events.GameEndedEvent(gameEndedMessage));
        }; };
        this.createMatch = function (socket) { return function (message) {
            debug("Received create match message %O", message);
            var playerTokens = _this.generateMatchTokens(message.players);
            message.players = message.players.map(function (player) { return playerTokens[player]; });
            var matchID = uuid_1.v4();
            var matchOutputChannel = {
                sendGameEnded: _this.sendGameEnded(socket),
                sendMatchEnded: _this.sendMatchEnded(socket),
                sendMessageToPlayer: _this.sendGameMessageToPlayer
            };
            _this.matches.set(matchID, _this.newMatchFn(message, matchOutputChannel));
            message.players.forEach(function (player) {
                _this.playerToMatchID.set(player, matchID);
            });
            socket.emit(new model_1.Events.MatchCreatedEvent({ playerTokens: playerTokens }));
        }; };
        this.sendPlayerMessageToGame = function (player) { return function (message) {
            if (!_this.playerToMatchID.has(player)) {
                debug("Player " + player + " does not have an associated game, cannot send player's message");
                return;
            }
            var matchId = _this.playerToMatchID.get(player);
            if (!_this.matches.has(matchId)) {
                debug("Match " + matchId + " not found, cannot send player " + player + "'s message");
            }
            _this.matches.get(matchId).onMessageFromPlayer(player, message.payload);
        }; };
        this.generateMatchTokens = function (players) {
            var gameTokens = {};
            players.forEach(function (player) { gameTokens[player] = uuid_1.v4(); });
            return gameTokens;
        };
        this.allPlayersReady = function (matchID) {
            var requiredPlayers = _this.matches.get(matchID).players;
            var currentPlayers = Object.entries(_this.playerToMatchID)
                .filter(function (entry) { return entry[1] === matchID; })
                .map(function (entry) { return entry[0]; });
            return requiredPlayers.every(function (requiredPlayer) { return currentPlayers.includes(requiredPlayer); });
        };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 5433;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        debug("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (rawSocket) {
            var socket = new model_1.Socket(rawSocket);
            socket.emit(new model_1.Events.GameInfoEvent(gameInfo));
            if (socket.socket.handshake.query && socket.socket.handshake.query.token) {
                var token = socket.socket.handshake.query.token;
                _this.playerToSocket.set(token, socket);
                socket.addHandler(new model_1.Handlers.PlayerToGameEventHandler(_this.sendPlayerMessageToGame(token)));
                var playersMatch = _this.playerToMatchID.get(token);
                if (playersMatch && _this.allPlayersReady(playersMatch)) {
                    _this.matches.get(playersMatch).start();
                }
            }
            else {
                socket.addHandler(new model_1.Handlers.CreateMatchEventHandler(_this.createMatch(socket)));
            }
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map