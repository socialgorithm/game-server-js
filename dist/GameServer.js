"use strict";
exports.__esModule = true;
var Events_1 = require("@socialgorithm/model/dist/Events");
var http = require("http");
var io = require("socket.io");
var uuid_1 = require("uuid");
var debug = require("debug")("sg:gameServer");
var GameServer = (function () {
    function GameServer(gameInfo, newMatchFn, serverOptions) {
        var _this = this;
        this.gameInfo = gameInfo;
        this.newMatchFn = newMatchFn;
        this.matches = new Map();
        this.playerToMatchID = new Map();
        this.playerToSocket = new Map();
        this.onTournamentServerConnected = function (tournamentServerMatchSocket) {
            tournamentServerMatchSocket.emit(Events_1.EventName.GameInfo, _this.gameInfo);
            tournamentServerMatchSocket.on(Events_1.EventName.CreateMatch, _this.createMatch(tournamentServerMatchSocket));
        };
        this.onPlayerConnected = function (playerSocket) {
            debug("New player connection %O", playerSocket.handshake.query);
            var token = playerSocket.handshake.query.token;
            _this.playerToSocket.set(token, playerSocket);
            playerSocket.on(Events_1.EventName.Game__Player, _this.sendPlayerMessageToGame(token));
            var matchThePlayerIsIn = _this.playerToMatchID.get(token);
            if (matchThePlayerIsIn && _this.allPlayersReady(matchThePlayerIsIn)) {
                debug("All players ready in " + matchThePlayerIsIn);
                _this.matches.get(matchThePlayerIsIn).start();
            }
            playerSocket.on("disconnect", function () {
                _this.onPlayerDisconnected(token);
            });
        };
        this.onPlayerDisconnected = function (token) {
            debug("Player " + token + " disconnected, removing");
            _this.playerToSocket["delete"](token);
        };
        this.createMatch = function (tournamentServerMatchSocket) { return function (message) {
            debug("Received create match message %O", message);
            var playerTokens = _this.generateMatchTokens(message.players);
            message.players = message.players.map(function (player) { return playerTokens[player]; });
            var matchID = uuid_1.v4();
            var matchOutputChannel = {
                sendGameEnded: _this.sendGameEnded(tournamentServerMatchSocket),
                sendMatchEnded: _this.removeMatchAndSendMatchEnded(matchID, tournamentServerMatchSocket),
                sendMessageToPlayer: _this.sendGameMessageToPlayer
            };
            _this.matches.set(matchID, _this.newMatchFn(message, matchOutputChannel));
            message.players.forEach(function (player) {
                _this.playerToMatchID.set(player, matchID);
            });
            tournamentServerMatchSocket.emit(Events_1.EventName.MatchCreated, { playerTokens: playerTokens });
        }; };
        this.removeMatchAndSendMatchEnded = function (matchID, tournamentServerMatchSocket) { return function () {
            debug("Match " + matchID + " ended, removing and sending MatchEnded");
            if (_this.matches.has(matchID)) {
                _this.matches.get(matchID).players.forEach(function (player) { return _this.playerToMatchID["delete"](player); });
                _this.matches["delete"](matchID);
            }
            tournamentServerMatchSocket.emit(Events_1.EventName.MatchEnded, null);
        }; };
        this.sendGameEnded = function (tournamentServerSocket) { return function (gameEndedMessage) {
            tournamentServerSocket.emit(Events_1.EventName.GameEnded, gameEndedMessage);
        }; };
        this.sendGameMessageToPlayer = function (player, payload) {
            if (!_this.playerToSocket.has(player)) {
                debug("Socket not found for player " + player + ", cannot send game message");
                return;
            }
            _this.playerToSocket.get(player).emit(Events_1.EventName.Game__Player, { payload: payload });
        };
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
            debug("%s requires players: %O", matchID, requiredPlayers);
            return requiredPlayers.every(function (requiredPlayer) {
                return _this.playerToSocket.has(requiredPlayer) && _this.playerToSocket.get(requiredPlayer).connected;
            });
        };
        var app = http.createServer();
        this.io = io(app);
        var port = serverOptions.port || 5433;
        app.listen(port);
        console.log("Started Socialgorithm Game Server on " + port);
        debug("Started Socialgorithm Game Server on " + port);
        this.io.on("connection", function (socket) {
            if (socket.handshake.query && socket.handshake.query.token) {
                _this.onPlayerConnected(socket);
            }
            else {
                _this.onTournamentServerConnected(socket);
            }
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map