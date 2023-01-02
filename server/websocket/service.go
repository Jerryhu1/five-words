package websocket

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room"
)

type Service struct {
	roomSrv     *room.Service
	connection  *Connection
	broadcaster Broadcaster
	handler     Handler
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

// RegisterConnection caches the websocket connection based on a generated guid and sends the guid back to the client
func (s *Service) RegisterConnection(conn *websocket.Conn) (string, error) {
	id, err := s.connection.RegisterConnection(conn)
	if err != nil {
		return "", err
	}

	b, err := json.Marshal(id)
	if err != nil {
		return "", err
	}

	msg, err := json.Marshal(SendMessage{
		Type: message.ClientRegistered,
		Body: b,
	})

	if err != nil {
		return "", err
	}

	err = conn.WriteMessage(websocket.TextMessage, msg)
	if err != nil {
		return "", err
	}

	return id, nil
}

// CloseConnection closes the websocket connection by removing it from the cache and setting the player as inactive
func (s *Service) CloseConnection(id string) error {
	err := s.connection.CloseConnection(id)
	if err != nil {
		return fmt.Errorf("could not remove connection: %v", err)
	}

	newState, err := s.roomSrv.SetPlayerActive(id, false)
	if err != nil {
		return fmt.Errorf("could not set player inactive: %s", id)
	}

	err = s.broadcaster.BroadcastRoomUpdate(newState, websocket.TextMessage)
	if err != nil {
		return err
	}

	fmt.Printf("Closed connection: %s\n", id)
	return nil
}

func (s *Service) ReceiveMessage(conn *websocket.Conn) error {
	_, p, err := conn.ReadMessage()
	if err != nil {
		return fmt.Errorf("failed to read message, err: %v", err)
	}

	m := ReceiveMessage{}
	err = json.Unmarshal(p, &m)
	if err != nil {
		return err
	}

	return s.handler.handle(m)
}
