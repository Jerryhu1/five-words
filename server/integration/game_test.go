package main

import (
	"bytes"
	"encoding/json"
	"fmt"
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
	"github.com/jerryhu1/five-words/room/state"
	ws "github.com/jerryhu1/five-words/websocket"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
)

func TestMain(m *testing.M) {
	err := setupEnv()
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
	sessionID, err := registerClient(conn)
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	_, err = joinRoom(resRoom.Name, sessionID, "Jerry", conn)
	if err != nil {
		t.FailNow()
	}

	send, _ := ws.CreateSendMessage("ADD_TEAM_PLAYER", message.AddTeamPlayerBody{
		RoomBody: message.RoomBody{
			RoomName: resRoom.Name,
		},
		PlayerID: sessionID,
		Team:     "Blue",
	})

	conn.WriteMessage(websocket.TextMessage, send)
	_, msg, err := conn.ReadMessage()
	if err != nil {

	}

	var reply ws.ReceiveMessage
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

	users := []string{"Jerry", "Tom", "John", "Doe"}

	for _, u := range users {
		conn, err := setupWsClient()
		if err != nil {
			log.Println(err)
			t.FailNow()
		}
		defer conn.Close()
		sessionID, err := registerClient(conn)
		if err != nil {
			log.Println(err)
			t.FailNow()
		}

		assert.NotNil(t, sessionID)

		res, err := joinRoom(resRoom.Name, sessionID, u, conn)
		if err != nil {
			t.FailNow()
		}

		assert.Equal(t, res.Players[sessionID].Name, u)
	}
}

func registerClient(conn *websocket.Conn) (string, error) {
	_, msg, err := conn.ReadMessage()
	if err != nil {
		return "", err
	}
	var registeredMsg ws.ReceiveMessage
	err = json.Unmarshal(msg, &registeredMsg)
	if err != nil {
		return "", err
	}

	if registeredMsg.Type != string(message.ClientRegistered) {
		return "", fmt.Errorf("message is not of type %s", message.ClientRegistered)
	}

	var sessionID string

	err = json.Unmarshal(registeredMsg.Body, &sessionID)
	if err != nil {
		return "", err
	}

	return sessionID, nil
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

	return unmarshalMessageToBody[state.RoomState](msg)
}

func createRoom() (state.RoomState, error) {
	payload := server.CreateRoomParams{
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

func setupEnv() error {
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

// unmarshalBody unmarshalls a json message to a concrete type T
func unmarshalMessageToBody[T any](msg []byte) (T, error) {
	var receive ws.SendMessage
	err := json.Unmarshal(msg, &receive)

	var res T
	err = json.Unmarshal(receive.Body, &res)
	if err != nil {
		return res, err
	}

	return res, nil
}
