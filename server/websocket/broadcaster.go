package websocket

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/chat"
	"github.com/jerryhu1/five-words/room/state"
)

type Broadcaster struct {
	connection *Connection
}

func (b *Broadcaster) BroadcastMessage(roomState state.RoomState, messageType int) error {
	partialCard := toPartialCardState(roomState)

	for k, v := range roomState.Players {
		if !v.IsActive {
			continue
		}

		conn, ok := b.connection.GetConnections()[k]
		if !ok {
			fmt.Printf("could not get connection with key: %s\n", k)
			continue
		}
		if k != roomState.CurrExplainer && !shouldShowCard(roomState) {
			err := writeResponse(conn, messageType, UpdateStateMessage{
				Type: "SET_ROOM",
				Body: partialCard,
			})
			if err != nil {
				return err
			}
			continue
		}

		err := writeResponse(conn, messageType, UpdateStateMessage{
			Type: "SET_ROOM",
			Body: roomState,
		})
		if err != nil {
			return err
		}
	}

	return nil
}

func (b *Broadcaster) BroadcastTimerDoneMessage(roomState state.RoomState, messageType int) error {
	for k, _ := range roomState.Players {
		conn, ok := b.connection.GetConnections()[k]
		if !ok {
			fmt.Printf("could not get connection with key: %s\n", k)
			continue
		}

		msg := ReplyMessage{Type: "TIMER_FINISHED"}

		final, err := json.Marshal(msg)
		if err != nil {
			return err

		}

		err = conn.WriteMessage(messageType, final)
		if err != nil {
			return err
		}

		return nil
	}

	return nil
}

func (b *Broadcaster) BroadcastChatMessage(roomState state.RoomState, chat chat.Chat) error {
	msg := AddChatMessage{
		Type: "ADD_MESSAGE",
		Body: chat,
	}

	for k, _ := range roomState.Players {
		conn, ok := b.connection.GetConnections()[k]
		if !ok {
			fmt.Printf("could not get connection with key: %s\n", k)
			continue
		}
		err := writeResponse(conn, websocket.TextMessage, msg)
		if err != nil {
			return err
		}
	}

	return nil
}

func writeResponse(conn *websocket.Conn, messageType int, msg interface{}) error {
	final, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return conn.WriteMessage(messageType, final)
}

func shouldShowCard(roomState state.RoomState) bool {
	return roomState.State != state.RoundOngoing &&
		roomState.State != state.RoundStarting &&
		roomState.State != state.LobbyStandby
}

func toPartialCardState(roomState state.RoomState) state.RoomState {
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

func NewBroadcaster(connection *Connection) Broadcaster {
	return Broadcaster{
		connection: connection,
	}
}
