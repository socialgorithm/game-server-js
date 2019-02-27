# JavaScript Game Server

Creates a socket server (default port 3333) that serves games. To use this server, you provide functions that will be called on game or player actions, and call functions to communicate with players or to broadcast game state to spectators.

## Integrating

Install the dependency:

`npm install @socialgorithm/game-server`

Start the game server:

```
  new GameServer({ port: 3333 }, {
    startGame: this.startGame,
    onPlayerMessage: this.onPlayerMessage,
  });
```

Supply functions to react to game events or player communication (`GameServerBindings`):

* `startGame: (options: GameOptions) => void;`
* `onPlayerMessage: (player: Player, payload: any) => void;`

Call functions when you want to communicate with players or broadcast game state to spectators (e.g. UIs):

* `sendPlayerMessage: (player: Player, payload: any) => void;`
* `sendGameMessage: (messageType: MessageType, payload: any) => void;`

### Example

See [tic-tac-toe](https://github.com/socialgorithm/tic-tac-toe) for an example of integration.

## Contributing

The rest of this guide is for contributors.

### Publishing to NPM

To publish to NPM, make sure you've incremented the version number and run:

```
yarn 
```