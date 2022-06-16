package websocket

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/jerryhu1/five-words/chat"
	"github.com/jerryhu1/five-words/message"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/state"
	"log"
	"time"
)

type Handler struct {
	roomSrv     *room.Service
	broadcaster Broadcaster
}

func (h Handler) handle(m ReceiveMessage) error {
	var err error
	var reply state.RoomState

	switch m.Type {
	case message.JoinRoom:
		body := message.JoinRoomBody{}
		err = json.Unmarshal(m.Body, &body)
		reply, err = h.roomSrv.AddPlayerToRoom(body.RoomName, body.SessionID, body.PlayerName)
		if err != nil {
			log.Println(err)
		}

	case message.AddTeamPlayer:
		payload := message.AddTeamPlayerBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.SetPlayerTeam(payload.RoomName, payload.PlayerID, payload.Team)
		if err != nil {
			log.Println(err)
		}
	case message.AddPlayerToRoom:
		payload := message.AddPlayerToRoomBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.AddPlayerToRoom(payload.RoomName, payload.SessionID, payload.PlayerName)
		if err != nil {
			log.Println(err)
		}
	case message.StartGame:
		payload := message.StartGameBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.StartGame(payload.RoomName)
		if err != nil {
			log.Println(err)
		}
	case message.StartRound:
		payload := message.StartRoundBody{}
		err = json.Unmarshal(m.Body, &payload)
		_, err := h.roomSrv.StartRound(payload.RoomName)
		if err != nil {
			log.Println(err)
			return nil
		}
		reply, err = h.startTimer(payload.RoomName, payload.RoundTime, payload.CountdownTime)
		if err != nil {
			log.Fatal(err)
		}
	case message.SendMessage:
		payload := message.SendMessageBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.CheckWord(payload.PlayerID, payload.RoomName, payload.Text)
		if err != nil {
			log.Fatal(err)
		}
		//TODO: give flag for when a message contains a correct answer
		err = h.broadcaster.BroadcastChatMessage(reply, chat.Chat{
			Timestamp:  time.Now(),
			Text:       payload.Text,
			PlayerID:   payload.PlayerID,
			PlayerName: payload.PlayerName,
		})
		if err != nil {
			log.Fatal(err)
		}
	case message.RestartGame:
		payload := message.RestartGameBody{}
		err = json.Unmarshal(m.Body, &payload)
		_, err := h.roomSrv.Reset(payload.RoomName)
		if err != nil {
			log.Fatal(err)
		}

		// TODO: Persist countdown time in settings
		reply, err = h.startTimer(payload.RoomName, reply.Settings.ScoreGoal, 3)
		if err != nil {
			log.Fatal(err)
		}
	case message.ToLobby:
		payload := message.ToLobbyBody{}
		err = json.Unmarshal(m.Body, &payload)
		reply, err = h.roomSrv.Reset(payload.RoomName)
		if err != nil {
			log.Fatal(err)
		}
	}

	err = h.broadcaster.BroadcastMessage(reply, websocket.TextMessage)
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
	doneChan := make(chan int, 1)
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
			fmt.Println(err)
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
func (h *Handler) startRound(roomName string, roundTime int, doneChan chan int) {
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
	err = h.broadcaster.BroadcastMessage(reply, websocket.TextMessage)
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
	err = h.broadcaster.BroadcastTimerDoneMessage(room, websocket.TextMessage)
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
	err = h.broadcaster.BroadcastMessage(reply, websocket.TextMessage)
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
