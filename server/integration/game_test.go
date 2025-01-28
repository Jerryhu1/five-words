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
	"github.com/jerryhu1/five-words/util/slice"
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

func TestCreateRoom(t *testing.T) {
	room, err := createRoom("Jerry")
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	assert.Equal(t, room.Owner, "Jerry")
	assert.Equal(t, room.ScoreGoal, 30)
	assert.Equal(t, room.Settings.Language, "en")
	assert.Equal(t, len(room.Teams), 4)
}

func TestStartGame(t *testing.T) {
	players := []*struct {
		name      string
		team      string
		sessionID string
		conn      *websocket.Conn
	}{
		{
			name: "Jerry",
			team: "Blue",
		},
		{
			name: "Alice",
			team: "Blue",
		},
		{
			name: "John",
			team: "Red",
		},
		{
			name: "Tom",
			team: "Red",
		},
	}

	room, err := createRoom(players[0].name)
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	for _, p := range players {
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
		_, err = joinRoom(room.Name, sessionID, p.name, conn)
		if err != nil {
			t.FailNow()
		}

		_, err = joinTeam(conn, room.Name, sessionID, p.team)
		if err != nil {
			log.Println(err)
			t.FailNow()
		}
		p.conn = conn
		p.sessionID = sessionID
	}

	payload := []byte(fmt.Sprintf("{\"sessionID\":\"%s\",\"type\":\"%s\",\"body\":{\"roomName\":\"%s\"}}", players[0].sessionID, string(message.StartGame), room.Name))
	players[0].conn.WriteMessage(websocket.TextMessage, payload)
}

func TestAddTeamPlayer(t *testing.T) {
	players := []struct {
		name string
		team string
	}{
		{
			name: "Jerry",
			team: "Blue",
		},
		{
			name: "Tom",
			team: "Red",
		},
		{
			name: "John",
			team: "Yellow",
		},
		{
			name: "Tom",
			team: "Blue",
		},
	}

	resRoom, err := createRoom(players[0].name)
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	for _, p := range players {
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
		_, err = joinRoom(resRoom.Name, sessionID, p.name, conn)
		if err != nil {
			t.FailNow()
		}

		reply, err := joinTeam(conn, resRoom.Name, sessionID, p.team)
		if err != nil {
			log.Println(err)
			t.FailNow()
		}
		assert.True(t, slice.Contains(reply.Teams[p.team].Players, sessionID))
	}
}

func TestAddPlayerToRoom(t *testing.T) {
	resRoom, err := createRoom("Jerry")
	if err != nil {
		log.Println(err)
		t.FailNow()
	}

	players := []string{"Jerry", "Tom", "John", "Doe"}

	for _, u := range players {
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
			log.Println(err)
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

func createRoom(owner string) (state.RoomState, error) {
	payload := server.CreateRoomParams{
		Owner:     owner,
		ScoreGoal: 30,
		Language:  "en",
		Teams:     4,
	}

	payloadJson, _ := json.Marshal(payload)

	resp, err := http.Post("http://localhost:9090/rooms", "application/json", bytes.NewReader(payloadJson))
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

func joinTeam(conn *websocket.Conn, room string, sessionID string, team string) (state.RoomState, error) {
	send, _ := ws.CreateSendMessage(message.AddTeamPlayer, message.AddTeamPlayerBody{
		RoomBody: message.RoomBody{
			RoomName: room,
		},
		PlayerID: sessionID,
		Team:     team,
	})

	conn.WriteMessage(websocket.TextMessage, send)
	_, msg, err := conn.ReadMessage()
	if err != nil {
		return state.RoomState{}, err
	}

	reply, err := unmarshalMessageToBody[state.RoomState](msg)
	if err != nil {
		return state.RoomState{}, err
	}

	return reply, nil
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

func setupEnv() error {
	err := godotenv.Load("../.env.local")
	if err != nil {
		log.Println("No local env file found, using defaults")
	}
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	pass := os.Getenv("REDIS_PASSWORD")
	go func() {
		err = server.Setup("9001", host, port, pass, "../card/data/words-simply.json")
		if err != nil {
			log.Println(err)
			return
		}
	}()
	time.Sleep(time.Second * 2)
	return nil
}
