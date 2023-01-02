package websocket

import (
	"errors"
	"fmt"
	"sync"

	"github.com/beevik/guid"
	"github.com/gorilla/websocket"
)

var ErrConnectionNotFound = errors.New("could not get connection")

// Connection is a struct that keeps the client websocket connections in memory
type Connection struct {
	mu          sync.Mutex
	connections map[string]*websocket.Conn
}

func (s *Connection) GetConnections() map[string]*websocket.Conn {
	return s.connections
}

func (s *Connection) GetConnection(guid string) (*websocket.Conn, error) {
	res, ok := s.connections[guid]
	if !ok {
		return nil, fmt.Errorf("%w, id: %s", ErrConnectionNotFound, guid)
	}

	return res, nil
}

func (s *Connection) RegisterConnection(conn *websocket.Conn) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	id := guid.NewString()
	s.connections[id] = conn
	return id, nil
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
