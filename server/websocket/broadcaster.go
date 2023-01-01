package websocket

import (
	"errors"
	"log"

	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/chat"
	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room/state"
)

type Broadcaster struct {
	connection *Connection
}

func NewBroadcaster(connection *Connection) Broadcaster {
	return Broadcaster{
		connection: connection,
	}
}

func (b Broadcaster) BroadcastRoomUpdate(roomState state.RoomState, messageType int) error {
	partialState := toPartialState(roomState)
	for k, v := range roomState.Players {
		if !v.IsActive {
			continue
		}

		conn, err := b.connection.GetConnection(k)
		if err != nil {
			log.Printf("could not get connection with key: %s\n", k)
			continue
		}
		if k == roomState.CurrExplainer || shouldShowCard(roomState) {
			err := writeResponse(conn, message.SetRoom, roomState)
			if err != nil {
				return err
			}
			continue
		}

		err = writeResponse(conn, message.SetRoom, partialState)
		if err != nil {
			return err
		}
	}

	return nil
}

func (b Broadcaster) BroadcastTimerDoneMessage(roomState state.RoomState) error {
	return b.broadcastMessage(message.TimerFinished, nil, roomState)
}

func (b Broadcaster) BroadcastChatMessage(roomState state.RoomState, chat chat.Chat) error {
	return b.broadcastMessage(message.AddMessage, chat, roomState)
}

func writeResponse(conn *websocket.Conn, messageType message.MessageType, body interface{}) error {
	msg, err := CreateSendMessage(messageType, body)
	if err != nil {
		return err
	}

	return conn.WriteMessage(websocket.TextMessage, msg)
}

func shouldShowCard(roomState state.RoomState) bool {
	return roomState.State != state.RoundOngoing &&
		roomState.State != state.RoundStarting &&
		roomState.State != state.LobbyStandby
}

func toPartialState(roomState state.RoomState) state.RoomState {
	if roomState.Timer == 0 {
		return roomState
	}

	roomState.CurrentCard = getPartialCardState(roomState.CurrentCard)
	return roomState
}

func getPartialCardState(c *card.Card) *card.Card {
	if c == nil {
		return nil
	}
	newCard := &card.Card{}
	for _, v := range c.Words {
		if v.Correct {
			newCard.Words = append(newCard.Words, v)
		}
	}

	return newCard
}

func (b Broadcaster) broadcastMessage(messageType message.MessageType, body interface{}, roomState state.RoomState) error {
	for k, _ := range roomState.Players {
		conn, err := b.connection.GetConnection(k)
		if err != nil {
			if errors.Is(err, ErrConnectionNotFound) {
				log.Println(err)
				continue
			}

			return err
		}

		err = writeResponse(conn, messageType, body)
		if err != nil {
			return err
		}
	}

	return nil
}
