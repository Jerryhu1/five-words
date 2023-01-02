# Five words

Five words is a browser based word-guessing party game based on the popular board game 30 Seconds. 

The goal of the game is to team up and battle your friends by guessing as many words from 
a card as possible in a 30-second time limit. 

The game should be played either in a voice call or in-person, since the words have to be explained. The players can type their guess in the chat box.  

See the app in action at ~~[heroku](https://five-words-web.herokuapp.com) - (while it is still free)~~ Heroku has dropped their free tier, which means the link does not work anymore. 

This game is still in development and there may be many bugs. 

![Game example](game.png)


## How to play
1. Visit the URL
2. Create a room 
3. Enter your name and adjust settings if needed
4. Share the room link to other players
5. Select a team, when there are 2 players per team, the game can start
6. A player from a team is selected randomly as explainer. Who will then start explaining the words without actually mentioning then. 
7. The players in the team should guess the words by typing them in the chat box. 
8. After the 30 seconds are over, the explainer submits the card and a new round begins. 
9. This will continue until the score goal is reached

## Development

The game is created using the following:

Backend:
* Go 1.19
* Redis
* Websockets

Frontend:
* React Typescript 
* Redux
* Next.js
* Tailwindcss

## Requirements

* Docker
* Go 1.19
* Node 
* Make (if not installed, check `Makefile` for the commands)

## Running the game locally

1. Run `make up` or `docker compose up -d` 
2. The game should be available at `localhost:3000`


## Dev setup

1. Spin up the containers: `make dev.start`
2. Boot up the backend: `make server`
3. Boot up the frontend: `make web`
