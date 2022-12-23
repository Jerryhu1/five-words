package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	server "github.com/jerryhu1/five-words/http"
	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/state"
	ws "github.com/jerryhu1/five-words/websocket"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	err := SetupEnv()
	if err != nil {
		log.Println(err)
		return
	}

	os.Exit(m.Run())
}

func TestAddTeamPlayer(t *testing.T) {
	resRoom, err := createRoom()
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	conn, err := setupWsClient()
	if err != nil {
		log.Println(err)
		t.FailNow()
	}
	defer conn.Close()
	registeredMsg, err := registerClient(conn)
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	_, err = joinRoom(resRoom.Name, registeredMsg.Body, "Jerry", conn)
	if err != nil {
		t.FailNow()
	}

	send, _ := ws.CreateSendMessage("ADD_TEAM_PLAYER", message.AddTeamPlayerBody{
		RoomBody: message.RoomBody{
			RoomName: resRoom.Name,
		},
		PlayerID: registeredMsg.Body,
		Team:     "Blue",
	})

	conn.WriteMessage(websocket.TextMessage, send)
	_, msg, err := conn.ReadMessage()
	if err != nil {

	}

	var reply ws.UpdateStateMessage
	err = json.Unmarshal(msg, &reply)

}

func TestCreateRoom(t *testing.T) {
	room, err := createRoom()
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	assert.Equal(t, room.Owner, "Jerry")
	assert.Equal(t, room.ScoreGoal, 30)
	assert.Equal(t, room.Settings.Language, "en")
	assert.Equal(t, len(room.Teams), 4)
}

func TestAddPlayerToRoom(t *testing.T) {
	resRoom, err := createRoom()
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	conn, err := setupWsClient()
	if err != nil {
		log.Println(err)
		t.FailNow()
	}
	defer conn.Close()
	registeredMsg, err := registerClient(conn)
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	assert.Equal(t, registeredMsg.Type, "CLIENT_REGISTERED")
	assert.NotNil(t, registeredMsg.Body)

	res, err := joinRoom(resRoom.Name, registeredMsg.Body, "Jerry", conn)
	if err != nil {
		t.FailNow()
	}

	assert.Equal(t, res.Players[registeredMsg.Body].Name, "Jerry")
}

func registerClient(conn *websocket.Conn) (ws.ClientRegisterMessage, error) {
	_, msg, err := conn.ReadMessage()
	if err != nil {
		return ws.ClientRegisterMessage{}, err
	}
	var registeredMsg ws.ClientRegisterMessage
	err = json.Unmarshal(msg, &registeredMsg)
	if err != nil {
		return ws.ClientRegisterMessage{}, err
	}

	return registeredMsg, nil
}

func joinRoom(roomName string, sessionID string, playerName string, conn *websocket.Conn) (state.RoomState, error) {
	joinRoomMessage := message.JoinRoomBody{
		RoomBody:   message.RoomBody{RoomName: roomName},
		PlayerName: playerName,
	}

	m, err := json.Marshal(joinRoomMessage)
	if err != nil {
		return state.RoomState{}, err
	}

	rec := ws.ReceiveMessage{
		SessionID: sessionID,
		Type:      "JOIN_ROOM",
		Body:      m,
	}

	m, err = json.Marshal(rec)
	if err != nil {
		return state.RoomState{}, err
	}

	conn.WriteMessage(websocket.TextMessage, m)
	_, msg, err := conn.ReadMessage()
	if err != nil {
		return state.RoomState{}, err
	}

	var reply ws.UpdateStateMessage
	err = json.Unmarshal(msg, &reply)
	if err != nil {
		return state.RoomState{}, err
	}

	return reply.Body, nil
}

func createRoom() (state.RoomState, error) {
	payload := room.CreateRoomParams{
		Owner:     "Jerry",
		ScoreGoal: 30,
		Language:  "en",
		Teams:     4,
	}

	payloadJson, _ := json.Marshal(payload)

	resp, err := http.Post("http://localhost:9090/rooms/create", "application/json", bytes.NewReader(payloadJson))
	if err != nil {
		return state.RoomState{}, err
	}

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return state.RoomState{}, err
	}

	var resBody state.RoomState
	err = json.Unmarshal(bytes, &resBody)
	if err != nil {
		return state.RoomState{}, err
	}

	return resBody, nil
}

func setupWsClient() (*websocket.Conn, error) {

	u := url.URL{Scheme: "ws", Host: "localhost:9090", Path: "/"}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("dial:", err)
	}

	return c, nil
}

func SetupEnv() error {
	err := godotenv.Load("../.env.local")
	if err != nil {
		log.Println("No local env file found, using defaults")
	}
	redisURL := os.Getenv("REDIS_URL")
	go func() {
		err = server.Setup("9090", redisURL, "../card/data/words-simply.json")
		if err != nil {
			log.Println(err)
			return
		}
	}()
	time.Sleep(time.Second * 2)
	return nil
}
