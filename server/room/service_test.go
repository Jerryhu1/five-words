package room

import (
	"sync"
	"testing"

	haikunator "github.com/atrox/haikunatorgo/v2"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/room/state"
	"github.com/stretchr/testify/assert"
)

func TestService_AddPlayerToRoom(t *testing.T) {
	type args struct {
		roomName   string
		sessionID  string
		playerName string
	}

	tests := []struct {
		name    string
		args    args
		want    state.RoomState
		wantErr bool
	}{
		{
			name: "should add player to the room",
			args: args{
				roomName:   "test room 1",
				sessionID:  "1234",
				playerName: "add test player 1",
			},
			want: func(s state.RoomState) state.RoomState {
				s.Players["1234"] = &state.Player{
					ID:       "1234",
					Name:     "add test player 1",
					IsActive: true,
				}
				return s
			}(mockRoomState()),
		},
		{
			name: "should fail to add conflicting ID to the room",
			args: args{
				roomName:   "test room 1",
				sessionID:  "1",
				playerName: "add test player 1",
			},
			wantErr: true,
		},
	}

	s := mockService()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := s.AddPlayer(tt.args.roomName, tt.args.sessionID, tt.args.playerName)
			if (err != nil) != tt.wantErr {
				t.Errorf("AddPlayerToRoom() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if (err != nil) == tt.wantErr {
				return
			}

			stateEqual(t, tt.want, got)
		})
	}
}

func TestService_CheckWord(t *testing.T) {

	type args struct {
		word       string
		playerName string
	}
	tests := []struct {
		name    string
		args    args
		want    state.RoomState
		wantErr bool
	}{
		{
			name: "should increment score with a correct word",
			args: args{
				word:       "test word 1",
				playerName: "test player 2",
			},
			want: func(roomState state.RoomState) state.RoomState {
				roomState.Teams["1"].Score += 1
				roomState.CurrentCard.Words[0].Correct = true
				return roomState
			}(mockRoomState()),
		},
		{
			name: "should not increment score if player not in team",
			args: args{
				word:       "test word 1",
				playerName: "test player 3",
			},
			want: func(roomState state.RoomState) state.RoomState {
				roomState.CurrentCard.Words[0].Correct = false
				return roomState
			}(mockRoomState()),
		},
		{
			name: "should not increment score if player is the explainer",
			args: args{
				word:       "test word 1",
				playerName: "test player 1",
			},
			want: func(roomState state.RoomState) state.RoomState {
				roomState.CurrentCard.Words[0].Correct = false
				return roomState
			}(mockRoomState()),
		},
	}

	s := mockService()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := s.CheckWord(tt.args.playerName, "", tt.args.word)

			if (err != nil) != tt.wantErr {
				t.Errorf("CheckWord() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			stateEqual(t, tt.want, got)
		})
	}
}

func stateEqual(t *testing.T, want state.RoomState, got state.RoomState) {
	for k := range want.Teams {
		assert.Equal(t, want.Teams[k], got.Teams[k])
	}

	for k := range want.Players {
		assert.Equal(t, want.Players[k], got.Players[k])
	}

	assert.Equal(t, *want.CurrentCard, *got.CurrentCard)
	assert.Equal(t, want.Timer, got.Timer)
	assert.Equal(t, want.State, got.State)
	assert.Equal(t, want.Settings, got.Settings)
	assert.Equal(t, want.Name, got.Name)
	assert.Equal(t, want.CurrExplainer, got.CurrExplainer)
	assert.Equal(t, want.Owner, got.Owner)
	assert.Equal(t, want.TeamTurn, got.TeamTurn)
	assert.Equal(t, want.ScoreGoal, got.ScoreGoal)
}

func mockService() Service {
	return Service{
		store:         mockStore{},
		card:          nil,
		nameGen:       haikunator.New(),
		mu:            sync.Mutex{},
		playerRoomMap: make(map[string]string),
	}
}

type mockStore struct{}

func (m mockStore) GetRoomState(name string) (state.RoomState, error) {
	return mockRoomState(), nil
}
func (m mockStore) SetRoomState(room state.RoomState) (state.RoomState, error) {
	return room, nil
}

func mockRoomState() state.RoomState {
	return state.RoomState{
		Name:  "test room",
		Owner: "test owner",
		Players: map[string]*state.Player{
			"1": {
				ID:       "1",
				Name:     "test player 1",
				IsActive: true,
			},
			"2": {
				ID:       "2",
				Name:     "test player 2",
				IsActive: true,
			},
			"3": {
				ID:       "3",
				Name:     "test player 3",
				IsActive: true,
			},
			"4": {
				ID:       "4",
				Name:     "test player 4",
				IsActive: true,
			},
		},
		Teams: map[string]*state.Team{
			"1": {
				ID:            "1",
				Name:          "test team 1",
				Score:         3,
				CurrExplainer: "test player 1",
				Players:       []string{"test player 1", "test player 2"},
			},
			"2": {
				ID:            "2",
				Name:          "test team 2",
				Score:         3,
				CurrExplainer: "test player 3",
				Players:       []string{"test player 3", "test player 4"},
			},
		},
		ScoreGoal: 10,
		TeamTurn:  "1",
		CurrentCard: &card.Card{Words: []card.Word{
			{
				ID:      "1",
				Text:    "test word 1",
				Correct: false,
			},
			{
				ID:      "2",
				Text:    "test word 2",
				Correct: false,
			},
		}},
		Timer:         1,
		Started:       true,
		State:         state.RoundOngoing,
		CurrExplainer: "test player 1",
		Settings:      state.Settings{},
	}
}
