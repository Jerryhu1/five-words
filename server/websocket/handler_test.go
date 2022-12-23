package websocket

import (
	"testing"

	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/room/state"
)

func TestHandler_handle(t *testing.T) {
	type args struct {
		m ReceiveMessage
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "should handle join room message",
			args: args{
				m: ReceiveMessage{
					SessionID: "1",
					Type:      "JOIN_ROOM",
					Body:      []byte("{\"sessionID\":\"1\",\"playerName\":\"Test\",\"roomName\":\"test-room\"}"),
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			h := Handler{
				roomSrv: roomServiceMock{},
			}
			if err := h.handle(tt.args.m); (err != nil) != tt.wantErr {
				t.Errorf("Handler.handle() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

type roomServiceMock struct {
	err error
}

func (r roomServiceMock) Create(owner string, scoreGoal int, language string, teams int) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) GetByName(name string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) AddPlayer(roomName string, sessionID string, playerName string) (state.RoomState, error) {
	return mockRoomState, r.err

}

func (r roomServiceMock) SetPlayerTeam(roomName string, playerID string, newTeam string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) SetPlayerActive(playerID string, isActive bool) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) IncrementScore(roomName string, teamName string, score int) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) StartGame(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) StartRound(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) SetTimer(roomName string, newTime int, gameState state.State) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) DecrementTimer(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) SetCard(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) CheckWord(playerID string, roomName string, word string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) Reset(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

func (r roomServiceMock) CheckVictory(roomName string) (state.RoomState, error) {
	return mockRoomState, r.err
}

type broadCasterMock struct {
}

var mockRoomState = state.RoomState{
	Name:  "name",
	Owner: "owner",
	Players: map[string]*state.Player{
		"Player 1": {
			ID:       "1",
			Name:     "Test",
			IsActive: true,
		},
	},
	Teams: map[string]*state.Team{
		"Team 1": {
			ID:            "1",
			Name:          "Team 1",
			Score:         0,
			CurrExplainer: "",
			Players:       []string{},
		},
	},
	ScoreGoal: 0,
	TeamTurn:  "",
	CurrentCard: &card.Card{
		Words: []card.Word{},
	},
	Timer:         0,
	Started:       false,
	State:         "",
	CurrExplainer: "",
	Settings: state.Settings{
		ScoreGoal: 0,
		Language:  "",
		RoundTime: 0,
	},
	WinnerTeam: "",
}
