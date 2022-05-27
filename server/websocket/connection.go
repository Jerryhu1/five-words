package websocket

import (
	"encoding/json"
	"fmt"
	"github.com/beevik/guid"
	"github.com/gorilla/websocket"
	"log"
	"sync"
)

type Connection struct {
	mu          sync.Mutex
	connections map[string]*websocket.Conn
}

func (s *Connection) GetConnections() map[string]*websocket.Conn {
	return s.connections
}

func (s *Connection) RegisterConnection(conn *websocket.Conn) string {
	s.mu.Lock()
	defer s.mu.Unlock()

	id := guid.NewString()
	s.connections[id] = conn
	fmt.Printf("Registered connection: %s\n", id)
	msg, err := json.Marshal(ClientRegisterMessage{
		Type: "CLIENT_REGISTERED",
		Body: id,
	})
	if err != nil {
		log.Println(err)
		return ""
	}

	err = conn.WriteMessage(websocket.TextMessage, msg)
	if err != nil {
		log.Println(err)
		return ""
	}

	return id
}

func (s *Connection) CloseConnection(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	_, ok := s.connections[id]
	if !ok {
		return fmt.Errorf("could not close connection: %s", id)
	}
	delete(s.connections, id)
	return nil
}

func NewConnection() *Connection {
	var connections = make(map[string]*websocket.Conn)
	return &Connection{
		connections: connections,
	}
}
