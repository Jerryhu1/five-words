package websocket

import (
	"encoding/json"

	"github.com/jerryhu1/five-words/message"
)

type ClientRegisterMessage struct {
	Type string `json:"type"`
	Body string `json:"body"`
}

// SendMessage is the payload the server sends to the client
type SendMessage struct {
	Type message.MessageType `json:"type"`
	Body json.RawMessage     `json:"body"`
}

// ReceiveMessage is the payload that the server receives from the client
type ReceiveMessage struct {
	SessionID string          `json:"sessionID"`
	Type      string          `json:"type"`
	Body      json.RawMessage `json:"body"`
}

// CreateSendMessage creates a SendMessage struct from the given message type and body
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
