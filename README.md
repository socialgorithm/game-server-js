# JavaScript Game Server

Creates a socket server (default port 5433) that serves games. To use this server, you provide functions that will be called on game or player actions, and call functions to communicate with players or to broadcast game state to spectators.

If you have no idea what any of this means, start at our [homepage](https://socialgorithm.org/) or [tournament documentation](https://socialgorithm.org/docs)

## Integrating

Install the dependency:

`npm install @socialgorithm/game-server`

Start the game server and supply a new match function:

```
  new GameServer({ name: "My Game Name" }, newMatchFunction, { port: 5433 });
```

The new match function:

* Must accept `MatchOptions`
* May accept an output channel on which to communicate with players/spectators. 
* Must return an implementation of the `Match` interface (i.e. must implement callback to listen for player communication).

```
  newMatchFunction(createMatchMessage: CreateMatchMessage, matchOutputChannel: MatchOutputChannel): Match {
    debug("Started new match");
    return new MyMatch(matchStartMessage.players, matchOutputChannel);
  }
```

In your game, you can then use `MatchOutputChannel` to communicate with players or spectators (e.g. the Tournament Server). 

### Example

See [tic-tac-toe](https://github.com/socialgorithm/tic-tac-toe) for an example of integration.

## Contributing

The rest of this guide is for contributors.

### Publishing to NPM

To publish to NPM, make sure you've incremented the version number (e.g. `npm version patch`) and run:

```
npm publish
```
