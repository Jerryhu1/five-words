package websocket

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/chat"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/state"
	"log"
)

type Service struct {
	roomSrv     *room.Service
	broadcaster Broadcaster
	connection  *Connection
	handler     Handler
}

type ClientRegisterMessage struct {
	Type string `json:"type"`
	Body string `json:"body"`
}

type ReplyMessage struct {
	Type string `json:"type"`
}

type UpdateStateMessage struct {
	Type string          `json:"type"`
	Body state.RoomState `json:"body"`
}

type ReceiveMessage struct {
	SessionID string          `json:"sessionID"`
	Type      string          `json:"type"`
	Body      json.RawMessage `json:"body"`
}

type AddChatMessage struct {
	Type string    `json:"type"`
	Body chat.Chat `json:"body"`
}

type Session struct {
	ID string `json:"session_id"`
}

func (s *Service) RegisterConnection(conn *websocket.Conn) string {
	return s.connection.RegisterConnection(conn)
}

func (s *Service) CloseConnection(id string) error {
	err := s.connection.CloseConnection(id)
	if err != nil {
		return fmt.Errorf("could not remove connection: %v", err)
	}

	newState, err := s.roomSrv.SetPlayerActive(id, false)
	if err != nil {
		return fmt.Errorf("could not set player inactive: %s", id)
	}

	err = s.broadcaster.BroadcastMessage(newState, websocket.TextMessage)
	if err != nil {
		return err
	}

	fmt.Printf("Closed connection: %s\n", id)
	return nil
}

func (s *Service) ReceiveMessage(conn *websocket.Conn) error {
	_, p, err := conn.ReadMessage()
	if err != nil {
		log.Println(err)
		return err
	}

	m := ReceiveMessage{}
	err = json.Unmarshal(p, &m)
	if err != nil {
		log.Println(err)
		return err
	}

	return s.handler.handle(m)
}

func New(roomSrv *room.Service) *Service {
	connection := NewConnection()
	b := NewBroadcaster(connection)
	handler := NewHandler(roomSrv, b)

	return &Service{
		roomSrv:     roomSrv,
		broadcaster: b,
		handler:     handler,
		connection:  connection,
	}
}
