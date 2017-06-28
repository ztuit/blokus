# Blokus
Javascript/ReactJS implementation of the game Blokus

![alt text](https://github.com/ztuit/blokus/blob/master/blokus.png)


Blokus is a four player game, each player has a set of pieces to layout on board, the objective is to block off the other players and place more pieces than them. For more info: https://en.wikipedia.org/wiki/Blokus

The game is distributed and each player needs their own page to play.  The first player creates a game (via http://localhost:8080), the other three players game join the game from a seperate page using the game id provided. 

The default version uses the file system for persistence, storagemgrCloud.js can be used instead for cloud persistence. For cloud persistence the application needs to be installed on the cloud and the keyfile linked to.

Project uses pure javascript and react with npm as the build tool.

To build and run:

`git clone https://github.com/ztuit/blokus.git`

`cd blokus/blokus_react`

`npm run build:all`

`npm start`
