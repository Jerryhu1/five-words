package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/api"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/redis"
	ws "github.com/jerryhu1/five-words/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

var websocketSrv *ws.Service
var roomSrv *room.Service

func main() {
	store, err := redis.NewStore()
	if err != nil {
		panic(err)
	}
	roomSrv = room.NewService(store)
	websocketSrv = ws.New(roomSrv)
	ctrl := api.NewCtrl(roomSrv)
	r := mux.NewRouter()
	r.Methods("OPTIONS").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, access-control-allow-origin")
		w.WriteHeader(http.StatusOK)
		return
	})

	r.HandleFunc("/", handle)
	r.HandleFunc("/room/create", ctrl.CreateRoom)
	r.HandleFunc("/room/{roomName}", ctrl.GetRoom)
	//r.HandleFunc("/room/{roomName}/add", ctrl.AddPlayerToRoom)
	//r.HandleFunc("/room/{roomName}/setPlayerTeam", ctrl.SetPlayerTeam)
	fmt.Println("Listening on port :8080")
	log.Fatal(http.ListenAndServe("127.0.0.1:8080", r))
}

func handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	defer conn.Close()
	id := websocketSrv.RegisterConnection(conn)
	fmt.Printf("New connection: %s\n", id)
	//	conn.CloseHandler()
	for {
		err = websocketSrv.ReceiveMessage(conn)
		if err != nil {
			fmt.Printf("could not receive message: %s", err)
			// Remove from connections
			err = websocketSrv.CloseConnection(id)
			if err != nil {
				fmt.Println(err)
			}
			break
		}
	}
}
