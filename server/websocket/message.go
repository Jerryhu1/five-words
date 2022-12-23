package websocket

import (
	"encoding/json"

	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room/state"
)

type ClientRegisterMessage struct {
	Type string `json:"type"`
	Body string `json:"body"`
}

type SendMessage struct {
	Type message.MessageType `json:"type"`
	Body json.RawMessage     `json:"body"`
}

// UpdateStateMessage is the
type UpdateStateMessage struct {
	Type string          `json:"type"`
	Body state.RoomState `json:"body"`
}

// ReceiveMessage is the payload that the server expects from the client
type ReceiveMessage struct {
	SessionID string          `json:"sessionID"`
	Type      string          `json:"type"`
	Body      json.RawMessage `json:"body"`
}

func CreateSendMessage(messageType message.MessageType, body interface{}) ([]byte, error) {
	b, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	return json.Marshal(SendMessage{
		Type: messageType,
		Body: b,
	})
}
