package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/chat"
	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/state"
)

type Handler struct {
	roomSrv     service
	broadcaster Broadcaster
	handlers    map[message.MessageType]MessageHandler
}

type service interface {
	Create(owner string, scoreGoal int, language string, teams int) (state.RoomState, error)
	GetByName(name string) (state.RoomState, error)
	AddPlayer(roomName string, sessionID string, playerName string) (state.RoomState, error)
	SetPlayerTeam(roomName string, playerID string, newTeam string) (state.RoomState, error)
	SetPlayerActive(playerID string, isActive bool) (state.RoomState, error)
	IncrementScore(roomName string, teamName string, score int) (state.RoomState, error)
	StartGame(roomName string) (state.RoomState, error)
	StartRound(roomName string) (state.RoomState, error)
	SetTimer(roomName string, newTime int, gameState state.State) (state.RoomState, error)
	DecrementTimer(roomName string) (state.RoomState, error)
	SetCard(roomName string) (state.RoomState, error)
	CheckWord(playerID string, roomName string, word string) (state.RoomState, error)
	Reset(roomName string) (state.RoomState, error)
	CheckVictory(roomName string) (state.RoomState, error)
}

type MessageHandler interface {
	Process(m ReceiveMessage) (*state.RoomState, error)
}

func (h Handler) handle(m ReceiveMessage) error {
	var err error
	var reply state.RoomState

	switch message.MessageType(m.Type) {
	case message.JoinRoom:
		body := message.JoinRoomBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}

		reply, err = h.roomSrv.AddPlayer(body.RoomName, m.SessionID, body.PlayerName)
		if err != nil {
			return err
		}

	case message.AddTeamPlayer:
		body := message.AddTeamPlayerBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}
		reply, err = h.roomSrv.SetPlayerTeam(body.RoomName, body.PlayerID, body.Team)
		if err != nil {
			return err
		}
	case message.AddPlayerToRoom:
		body := message.AddPlayerToRoomBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}
		reply, err = h.roomSrv.AddPlayer(body.RoomName, m.SessionID, body.PlayerName)
		if err != nil {
			return err
		}
	case message.StartGame:
		body := message.StartGameBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}
		reply, err = h.roomSrv.StartGame(body.RoomName)
		if err != nil {
			return err
		}
	case message.StartRound:
		body := message.StartRoundBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}

		_, err := h.roomSrv.StartRound(body.RoomName)
		if err != nil {
			return err
		}

		reply, err = h.startTimer(body.RoomName, body.RoundTime, body.CountdownTime)
		if err != nil {
			return err
		}
	case message.SendMessage:
		body := message.SendMessageBody{}
		if err := json.Unmarshal(m.Body, &body); err != nil {
			return err
		}

		reply, err = h.roomSrv.CheckWord(body.PlayerID, body.RoomName, body.Text)
		if err != nil {
			return err
		}

		//TODO: give flag for when a message contains a correct answer
		err = h.broadcaster.BroadcastChatMessage(reply, chat.Chat{
			Timestamp:  time.Now(),
			Text:       body.Text,
			PlayerID:   body.PlayerID,
			PlayerName: body.PlayerName,
		})
		if err != nil {
			return err
		}
	case message.RestartGame:
		payload := message.RestartGameBody{}
		err = json.Unmarshal(m.Body, &payload)
		_, err := h.roomSrv.Reset(payload.RoomName)
		if err != nil {
			return err
		}

		// TODO: Persist countdown time in settings
		reply, err = h.startTimer(payload.RoomName, reply.Settings.ScoreGoal, 5)
		if err != nil {
			return err
		}
	case message.ToLobby:
		payload := message.ToLobbyBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.Reset(payload.RoomName)
		if err != nil {
			log.Fatal(err)
		}
	}

	err = h.broadcaster.BroadcastRoomUpdate(reply, websocket.TextMessage)
	if err != nil {
		fmt.Println(err)
	}

	return nil
}

func (h *Handler) startTimer(roomName string, roundTime int, countdownTime int) (state.RoomState, error) {
	reply, err := h.roomSrv.SetTimer(roomName, countdownTime, state.RoundStarting)
	if err != nil {
		return state.RoomState{}, err
	}
	doneChan := make(chan bool, 1)
	// Initial countdown
	go h.runTimer(roomName, websocket.TextMessage, doneChan)
	go h.startRound(roomName, roundTime, doneChan)
	return reply, nil
}

func (h *Handler) runTimer(roomName string, messageType int, resChan chan int) {
	for {
		time.Sleep(time.Second)
		newState, err := h.roomSrv.DecrementTimer(roomName)
		if err != nil {
			log.Println(err)
			break
		}
		err = h.broadcaster.BroadcastMessage(newState, messageType)
		if err != nil {
			log.Println(err)
			break
		}

		if newState.Timer == 0 {
			resChan <- 0
			break
		}
	}
}

// Function needs some refactoring
// Round timer countdown
func (h *Handler) startRound(roomName string, roundTime int, doneChan chan bool) {
	// Wait till initial timer is done
	<-doneChan
	// Set card
	reply, err := h.roomSrv.SetCard(roomName)
	if err != nil {
		log.Println(err)
		return
	}
	// Start another timer that takes x seconds
	reply, err = h.roomSrv.SetTimer(roomName, roundTime, state.RoundOngoing)
	if err != nil {
		log.Println(err)
		return
	}
	// Update client
	err = h.broadcaster.BroadcastRoomUpdate(reply, websocket.TextMessage)
	if err != nil {
		log.Println(err)
		return
	}
	go h.runTimer(roomName, websocket.TextMessage, doneChan)
	<-doneChan
	close(doneChan)
	// Get state in case something changed in the meantime
	room, err := h.roomSrv.GetByName(roomName)
	if err != nil {
		log.Println(err)
		return
	}
	// Return that the timer is done
	err = h.broadcaster.BroadcastTimerDoneMessage(room)
	if err != nil {
		log.Println(err)
		return
	}

	// Check if team has won
	reply, err = h.roomSrv.CheckVictory(roomName)
	if err != nil {
		return
	}

	// Update client
	err = h.broadcaster.BroadcastRoomUpdate(reply, websocket.TextMessage)
	if err != nil {
		log.Println(err)
		return
	}
}

func NewHandler(r *room.Service, broadcaster Broadcaster) Handler {
	return Handler{
		roomSrv:     r,
		broadcaster: broadcaster,
	}
}
