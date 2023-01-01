package http

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/room"
	redis "github.com/jerryhu1/five-words/room/store"
	ws "github.com/jerryhu1/five-words/websocket"
)

var websocketSrv *ws.Service
var roomSrv *room.Service

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func Setup(port string, redisHost string, redisPort string, redisPassword string, wordsPath string) error {
	store, err := redis.NewStore(redisHost, redisPort, "", redisPassword)
	if err != nil {
		return fmt.Errorf("could not create redis store: %s", err)
	}

	cardSrv, err := card.NewService(wordsPath)

	roomSrv, err = room.NewService(cardSrv, store)
	if err != nil {
		return fmt.Errorf("could not create room service: %s", err)
	}

	websocketSrv = ws.New(roomSrv)
	ctrl := NewController(roomSrv)
	r := mux.NewRouter()

	r.HandleFunc("/", upgrade)
	r.HandleFunc("/rooms", ctrl.CreateRoom)
	r.HandleFunc("/rooms/{roomName}", ctrl.GetRoom)

	address := fmt.Sprintf(":%s", port)
	fmt.Printf("Listening on port :%s\n", port)
	log.Fatal(http.ListenAndServe(address, r))
	return nil
}

func upgrade(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "method not allowed", 405)
	}
	w.Header().Add("Access-Control-Allow-Origin", "localhost:3000")
	// w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	// w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	defer conn.Close()
	id, err := websocketSrv.RegisterConnection(conn)
	if err != nil {
		log.Println(err)
		return
	}

	log.Printf("New connection: %s\n", id)
	for {
		err = websocketSrv.ReceiveMessage(conn)
		if err != nil {
			fmt.Printf("could not handle message: %s", err)
			// Remove from connections
			err = websocketSrv.CloseConnection(id)
			if err != nil {
				log.Println(err)
			}
			break
		}
	}
}
