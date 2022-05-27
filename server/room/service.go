package room

import (
	"errors"
	"fmt"
	"github.com/jerryhu1/five-words/card"
	"github.com/jerryhu1/five-words/player"
	"github.com/jerryhu1/five-words/room/state"
	"github.com/jerryhu1/five-words/util/slice"

	haikunator "github.com/atrox/haikunatorgo/v2"
	"github.com/beevik/guid"

	"math/rand"
	"sync"
	"time"
)

type Service struct {
	store         Store
	card          *card.Service
	nameGen       *haikunator.Haikunator
	mu            sync.Mutex
	playerRoomMap map[string]string
}

type CreateRoomParams struct {
	PlayerName string `json:"player_name"`
	ScoreGoal  int    `json:"score_goal"`
	Language   string `json:"language"`
}

type Store interface {
	GetRoomState(name string) (state.RoomState, error)
	SetRoomState(room state.RoomState) (state.RoomState, error)
}

var (
	ErrNotFound  = errors.New("could not resource")
	ErrEmptyList = errors.New("could not get random object from empty list")
)

func (s *Service) Create(params CreateRoomParams) (state.RoomState, error) {
	roomName := s.nameGen.Haikunate()
	room := state.RoomState{
		Name:    roomName,
		Owner:   params.PlayerName,
		Players: map[string]*state.Player{},
		Teams: map[string]*state.Team{
			"Blue": {
				ID:      guid.NewString(),
				Name:    "Blue",
				Players: []string{},
			},
			"Red": {
				ID:      guid.NewString(),
				Name:    "Red",
				Players: []string{},
			},
		},
		ScoreGoal:   params.ScoreGoal,
		TeamTurn:    "",
		CurrentCard: nil,
		Settings:    state.Settings{Language: params.Language},
	}

	res, err := s.store.SetRoomState(room)
	if err != nil {
		return state.RoomState{}, err
	}

	return res, nil
}

func (s *Service) GetByName(name string) (state.RoomState, error) {
	res, err := s.store.GetRoomState(name)
	if err != nil {
		return state.RoomState{}, fmt.Errorf("could not get room with name:%s, err: %v", name, err)
	}

	return res, nil
}

func (s *Service) AddPlayerToRoom(roomName string, sessionID string, playerName string) (state.RoomState, error) {
	res, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}

	_, ok := res.Players[sessionID]
	if ok {
		return state.RoomState{}, fmt.Errorf("could not add player due to conflicting IDs: %s", sessionID)
	}

	newPlayer := player.NewPlayer(sessionID, playerName)
	res.Players[sessionID] = &newPlayer
	s.mu.Lock()
	{
		s.playerRoomMap[sessionID] = roomName
	}
	s.mu.Unlock()
	return s.store.SetRoomState(res)
}

func (s *Service) SetPlayerTeam(roomName string, playerID string, newTeam string) (state.RoomState, error) {
	currState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}

	// Check if player exists
	p, ok := currState.Players[playerID]
	if !ok {
		return state.RoomState{}, fmt.Errorf("could not add player to team, player: %s does not exist", playerID)
	}

	t, ok := currState.Teams[newTeam]
	if !ok {
		return state.RoomState{}, fmt.Errorf("could not add player to team, team: %s does not exist", roomName)
	}

	if t.Players == nil {
		t.Players = []string{}
	}

	// Delete from old team
	oldTeam, ok := getTeamForPlayer(currState, p.ID)
	if ok {
		players := currState.Teams[oldTeam].Players
		for i, v := range players {
			if v == p.ID {
				currState.Teams[oldTeam].Players = append(players[:i], players[i+1:]...)
				break
			}
		}
	}

	t.Players = append(t.Players, playerID)
	return s.store.SetRoomState(currState)
}

func (s *Service) IncrementScore(roomName string, teamName string, score int) (state.RoomState, error) {
	res, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}
	res.Teams[teamName].Score = res.Teams[teamName].Score + score

	res, err = s.store.SetRoomState(res)
	if err != nil {
		return state.RoomState{}, err
	}

	return res, nil
}

func (s *Service) SetPlayerActive(playerID string, isActive bool) (state.RoomState, error) {
	roomName, ok := s.playerRoomMap[playerID]
	if !ok {
		return state.RoomState{}, fmt.Errorf("%w, could not find player: %s", ErrNotFound, playerID)
	}

	roomState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}

	roomState.Players[playerID].IsActive = isActive
	newState, err := s.store.SetRoomState(roomState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

func (s *Service) StartGame(roomName string) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}
	team, err := selectRandomTeam(oldState.Teams)
	if err != nil {
		return state.RoomState{}, err
	}
	oldState.TeamTurn = team
	nextPlayer, err := selectRandomPlayer(oldState.Teams[team].Players)
	if err != nil {
		return state.RoomState{}, err
	}
	oldState.Teams[team].CurrExplainer = nextPlayer

	// Set timer to 3 for countdown
	oldState.Timer = 3
	oldState.Started = true
	newState, err := s.store.SetRoomState(oldState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

func (s *Service) StartRound(roomName string) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}

	nextTeamID := getNextTeamInMap(oldState.TeamTurn, oldState.Teams)
	nextTeam := oldState.Teams[nextTeamID]

	oldState.TeamTurn = nextTeamID
	nextPlayer, err := selectRandomPlayer(nextTeam.Players)
	if nextTeam.CurrExplainer == "" {
		oldState.Teams[nextTeamID].CurrExplainer = nextPlayer
	} else {
		oldState.Teams[nextTeamID].CurrExplainer =
			getNextStringInArray(nextTeam.CurrExplainer, nextTeam.Players)
	}

	// Set timer to 3 for countdown
	oldState.Timer = 3
	oldState.Started = true
	newState, err := s.store.SetRoomState(oldState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

func (s *Service) SetTimer(roomName string, newTime int, gameState state.State) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}
	oldState.Timer = newTime
	oldState.State = gameState
	newState, err := s.store.SetRoomState(oldState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

func (s *Service) DecrementTimer(roomName string) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}
	oldState.Timer -= 1
	newState, err := s.store.SetRoomState(oldState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

func (s *Service) SetCard(roomName string) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}
	if oldState.TeamTurn == "" {
		return state.RoomState{}, fmt.Errorf("no team is on turn now, something went wrong")
	}

	explainer := oldState.Teams[oldState.TeamTurn].CurrExplainer
	card := s.card.GetRandomCard()
	oldState.CurrentCard = &card
	oldState.CurrExplainer = explainer
	newState, err := s.store.SetRoomState(oldState)
	if err != nil {
		return state.RoomState{}, err
	}

	return newState, nil
}

// CheckWord checks whether a word given is present in the card and increments the score of the current explaining team if correct
func (s *Service) CheckWord(playerID string, roomName string, word string) (state.RoomState, error) {
	roomState, err := s.GetByName(roomName)
	if err != nil {
		return state.RoomState{}, fmt.Errorf("%w, %v", ErrNotFound, err)
	}

	playersInTeam := roomState.Teams[roomState.TeamTurn].Players
	// Only players in own team, exlucing the explainer
	if !slice.Contains[string](playersInTeam, playerID) || roomState.CurrExplainer == playerID {
		return roomState, nil
	}

	if roomState.Timer == 0 {
		return roomState, nil
	}

	s.card.CheckWord(roomState.CurrentCard, word)

	updateScore(&roomState)

	return s.store.SetRoomState(roomState)
}

func updateScore(roomState *state.RoomState) {
	score := 0
	for _, v := range roomState.CurrentCard.Words {
		if v.Correct {
			score++
		}
	}
	roomState.Teams[roomState.TeamTurn].Score = score
}

func getTeamForPlayer(room state.RoomState, playerID string) (string, bool) {
	for k, v := range room.Teams {
		for _, v2 := range v.Players {
			if v2 == playerID {
				return k, true
			}
		}
	}

	return "", false
}

func selectRandomTeam(m map[string]*state.Team) (string, error) {
	if len(m) == 0 {
		return "", ErrEmptyList
	}
	rand.Seed(time.Now().UnixNano())
	keys := make([]string, len(m))
	randIdx := rand.Intn(len(m))
	counter := 0
	for k := range m {
		keys[counter] = k
		counter++
	}

	return keys[randIdx], nil
}

func selectRandomPlayer(players []string) (string, error) {
	if len(players) == 0 {
		return "", ErrEmptyList
	}
	rand.Seed(time.Now().UnixNano())
	randIdx := rand.Intn(len(players))
	return players[randIdx], nil
}

func getNextTeamInMap(curr string, m map[string]*state.Team) string {
	arr := make([]string, len(m))
	counter := 0
	index := 0
	for k := range m {
		arr[counter] = k
		if k == curr {
			index = counter
		}
		counter++
	}
	if index == len(arr)-1 {
		index = 0
	} else {
		index++
	}

	return arr[index]
}

func getNextStringInArray(curr string, arr []string) string {
	index := 0
	for i, v := range arr {
		arr = append(arr, v)
		if v == curr {
			index = i
		}
	}

	if index == len(arr)-1 {
		index = 0
	} else {
		index++
	}

	return arr[index]
}

func NewService(store Store) *Service {
	h := haikunator.New()
	h.TokenLength = 0
	playerRoomMap := make(map[string]string)
	cardSrv := card.NewService()
	return &Service{store: store, nameGen: h, playerRoomMap: playerRoomMap, card: cardSrv}
}
