"use strict";
exports.__esModule = true;
var GameServer = (function () {
    function GameServer(bindings) {
        var _this = this;
        this.bindings = bindings;
        this.sendPlayerMessage = function (player, payload) {
            _this.socket.send(player, payload);
        };
        this.sendGameMessage = function (type, payload) {
            _this.socket.send(type, payload);
        };
        this.socket = {};
        this.socket.on('startGame', this.bindings.startGame);
        this.socket.on('playerMessage', this.bindings.onPlayerMessage);
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map