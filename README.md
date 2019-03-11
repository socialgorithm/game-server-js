# JavaScript Game Server

Creates a socket server (default port 5433) that serves games. To use this server, you provide functions that will be called on game or player actions, and call functions to communicate with players or to broadcast game state to spectators.

## Integrating

Install the dependency:

`npm install @socialgorithm/game-server`

Start the game server and supply a new game function:

```
  new GameServer({ name: "My Game Name" }, newGameFunction, { port: 5433 });
```

The new game function must accept game start parameters and can take an output channel on which to communicate with players/spectactors. It must return an implementation of the `Game` interface (i.e. must implement callback to listen for player communication).

```
  newGameFunction(gameStartMessage: GameStartMessage, outputChannel: GameOutputChannel): Game {
    debug("Started new Tic Tac Toe Game");
    return new TicTacToeGame(gameStartMessage.players, outputChannel);
  }
```

### Example

See [tic-tac-toe](https://github.com/socialgorithm/tic-tac-toe) for an example of integration.

## Contributing

The rest of this guide is for contributors.

### Publishing to NPM

To publish to NPM, make sure you've incremented the version number (e.g. `npm version patch`) and run:

```
npm publish
```