# Five words backend

The backend of five words is a Go 1.19 application. It uses `gorilla/websockets` to accept websocket connections. 

Redis is used as a store for the game state. 

Environment variables are handled by a `.env` files. Make to have a `.env.local` file for local development. `.env.example.local` can be used for defaults. 

Start the server by running `make dev.start` or `go run cmd/main.go`

Run the tests by executing `make test` for unit tests or `make test.it` for integration tests. 