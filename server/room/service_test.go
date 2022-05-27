package room

import (
	haikunator "github.com/atrox/haikunatorgo/v2"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/room/state"
	"github.com/stretchr/testify/assert"
	"reflect"
	"sync"
	"testing"
)

var rs = mockRoomState()

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
			got, err := s.AddPlayerToRoom(tt.args.roomName, tt.args.sessionID, tt.args.playerName)
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
		roomName string
		word     string
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
				word: "test word 1",
			},
			want: func(roomState state.RoomState) state.RoomState {
				roomState.Teams["1"].Score += 1
				roomState.CurrentCard.Words[0].Correct = true
				return roomState
			}(mockRoomState()),
		},
	}

	s := mockService()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := s.CheckWord(tt.args.roomName, tt.args.word)

			if (err != nil) != tt.wantErr {
				t.Errorf("CheckWord() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			stateEqual(t, tt.want, got)
		})
	}
}

func stateEqual(t *testing.T, want state.RoomState, got state.RoomState) {
	for k, _ := range want.Teams {
		assert.Equal(t, want.Teams[k], got.Teams[k])
	}

	for k, _ := range want.Players {
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

func TestService_Create(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		params CreateRoomParams
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.Create(tt.args.params)
			if (err != nil) != tt.wantErr {
				t.Errorf("Create() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Create() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_DecrementTimer(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.DecrementTimer(tt.args.roomName)
			if (err != nil) != tt.wantErr {
				t.Errorf("DecrementTimer() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("DecrementTimer() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_GetByName(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		name string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.GetByName(tt.args.name)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetByName() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetByName() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_IncrementScore(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
		teamName string
		score    int
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.IncrementScore(tt.args.roomName, tt.args.teamName, tt.args.score)
			if (err != nil) != tt.wantErr {
				t.Errorf("IncrementScore() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("IncrementScore() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_SetCard(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.SetCard(tt.args.roomName)
			if (err != nil) != tt.wantErr {
				t.Errorf("SetCard() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("SetCard() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_SetPlayerActive(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		playerID string
		isActive bool
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.SetPlayerActive(tt.args.playerID, tt.args.isActive)
			if (err != nil) != tt.wantErr {
				t.Errorf("SetPlayerActive() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("SetPlayerActive() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_SetPlayerTeam(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
		playerID string
		newTeam  string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.SetPlayerTeam(tt.args.roomName, tt.args.playerID, tt.args.newTeam)
			if (err != nil) != tt.wantErr {
				t.Errorf("SetPlayerTeam() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("SetPlayerTeam() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_SetTimer(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName  string
		newTime   int
		gameState state.State
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.SetTimer(tt.args.roomName, tt.args.newTime, tt.args.gameState)
			if (err != nil) != tt.wantErr {
				t.Errorf("SetTimer() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("SetTimer() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_StartGame(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.StartGame(tt.args.roomName)
			if (err != nil) != tt.wantErr {
				t.Errorf("StartGame() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("StartGame() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestService_StartRound(t *testing.T) {
	type fields struct {
		store         Store
		card          *card.Service
		nameGen       *haikunator.Haikunator
		mu            sync.Mutex
		playerRoomMap map[string]string
	}
	type args struct {
		roomName string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    state.RoomState
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				store:         tt.fields.store,
				card:          tt.fields.card,
				nameGen:       tt.fields.nameGen,
				mu:            tt.fields.mu,
				playerRoomMap: tt.fields.playerRoomMap,
			}
			got, err := s.StartRound(tt.args.roomName)
			if (err != nil) != tt.wantErr {
				t.Errorf("StartRound() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("StartRound() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getNextStringInArray(t *testing.T) {
	type args struct {
		curr string
		arr  []string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getNextStringInArray(tt.args.curr, tt.args.arr); got != tt.want {
				t.Errorf("getNextStringInArray() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getNextTeamInMap(t *testing.T) {
	type args struct {
		curr string
		m    map[string]*state.Team
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getNextTeamInMap(tt.args.curr, tt.args.m); got != tt.want {
				t.Errorf("getNextTeamInMap() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getTeamForPlayer(t *testing.T) {
	type args struct {
		room     state.RoomState
		playerID string
	}
	tests := []struct {
		name  string
		args  args
		want  string
		want1 bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, got1 := getTeamForPlayer(tt.args.room, tt.args.playerID)
			if got != tt.want {
				t.Errorf("getTeamForPlayer() got = %v, want %v", got, tt.want)
			}
			if got1 != tt.want1 {
				t.Errorf("getTeamForPlayer() got1 = %v, want %v", got1, tt.want1)
			}
		})
	}
}

func Test_selectRandomPlayer(t *testing.T) {
	type args struct {
		players []string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := selectRandomPlayer(tt.args.players)
			if (err != nil) != tt.wantErr {
				t.Errorf("selectRandomPlayer() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("selectRandomPlayer() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_selectRandomTeam(t *testing.T) {
	type args struct {
		m map[string]*state.Team
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr bool
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := selectRandomTeam(tt.args.m)
			if (err != nil) != tt.wantErr {
				t.Errorf("selectRandomTeam() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("selectRandomTeam() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_updateScore(t *testing.T) {
	type args struct {
		roomState *state.RoomState
	}
	tests := []struct {
		name string
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
		})
	}
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
				Players:       []string{"1", "2"},
			},
			"2": {
				ID:            "2",
				Name:          "test team 2",
				Score:         3,
				CurrExplainer: "test player 3",
				Players:       []string{"3", "4"},
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
