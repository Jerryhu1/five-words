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
	store         store
	card          *card.Service
	nameGen       *haikunator.Haikunator
	mu            sync.Mutex
	playerRoomMap map[string]string
}

type store interface {
	GetRoomState(name string) (state.RoomState, error)
	SetRoomState(room state.RoomState) (state.RoomState, error)
}

var (
	ErrNotFound     = errors.New("could not resource")
	ErrInvalidInput = errors.New("the input could not be validated")
	ErrEmptyList    = errors.New("could not get random object from empty list")
)

var teamNames = []string{"Blue", "Red", "Yellow", "Green"}

func NewService(cardService card.Service, store store) (*Service, error) {
	h := haikunator.New()
	h.TokenLength = 0
	playerRoomMap := make(map[string]string)
	return &Service{store: store, nameGen: h, playerRoomMap: playerRoomMap, card: &cardService}, nil
}

func (s *Service) Create(owner string, scoreGoal int, language string, numTeams int) (state.RoomState, error) {
	teams := make(map[string]*state.Team, numTeams)
	for i := 0; i < numTeams; i++ {
		teams[teamNames[i]] = &state.Team{
			ID:      guid.NewString(),
			Name:    teamNames[i],
			Players: []string{},
		}
	}
	roomName := s.nameGen.Haikunate()
	room := state.RoomState{
		Name:        roomName,
		Owner:       owner,
		Players:     map[string]*state.Player{},
		Teams:       teams,
		ScoreGoal:   scoreGoal,
		TeamTurn:    "",
		CurrentCard: nil,
		Settings:    state.Settings{Language: language},
	}

	res, err := s.store.SetRoomState(room)
	if err != nil {
		return state.RoomState{}, err
	}

	return res, nil
}

// GetByName gets a room by name
func (s *Service) GetByName(name string) (state.RoomState, error) {
	res, err := s.store.GetRoomState(name)
	if err != nil {
		return state.RoomState{}, fmt.Errorf("could not get room with name:%s, err: %v", name, err)
	}

	return res, nil
}

// AddPlayer adds a player to the room
func (s *Service) AddPlayer(roomName string, sessionID string, playerName string) (state.RoomState, error) {
	if roomName == "" || sessionID == "" || playerName == "" {
		return state.RoomState{}, fmt.Errorf("could not add player to room, roomName: %s, sessionID: %s, playerName %s, err %v", roomName, sessionID, playerName, ErrInvalidInput)
	}
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

// SetPlayerTeam sets the team of a player by sessionID, if the player is already in another team, it will be removed from it.
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

// IncrementScore increases the room timer by 1
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

// SetPlayerActive sets a given player by sessionID to active or unactive
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

// StartGame starts the game by selecting a random starting team and explainer. It will then start the countdown.
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

// StartRound starts a new round by choosing the next team and explainer. It will then start the countdown.
func (s *Service) StartRound(roomName string) (state.RoomState, error) {
	oldState, err := s.store.GetRoomState(roomName)
	if err != nil {
		return state.RoomState{}, err
	}

	nextTeamID := getNextTeamInMap(oldState.TeamTurn, oldState.Teams)
	nextTeam := oldState.Teams[nextTeamID]

	oldState.TeamTurn = nextTeamID
	nextPlayer, err := selectRandomPlayer(nextTeam.Players)
	if err != nil {
		return state.RoomState{}, err
	}

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

// SetTimer sets the room timer to the given `newTime`
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

// DecrementTimer decreases the room timer by 1
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

// SetCard selects a random card randomly and sets it in the roomState
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
	// Only players in own team, exlucing the explainer can guess
	if !slice.Contains(playersInTeam, playerID) || roomState.CurrExplainer == playerID {
		return roomState, nil
	}

	if roomState.Timer == 0 || roomState.CurrentCard == nil {
		return roomState, nil
	}

	newCard, correct := card.CheckWord(*roomState.CurrentCard, word)
	roomState.CurrentCard = &newCard

	if correct {
		roomState.Teams[roomState.TeamTurn].Score += 1
	}
	return s.store.SetRoomState(roomState)
}

func (s *Service) Reset(roomName string) (state.RoomState, error) {
	roomState, err := s.GetByName(roomName)
	if err != nil {
		return state.RoomState{}, fmt.Errorf("%w, %v", ErrNotFound, err)
	}

	for _, v := range roomState.Teams {
		v.Score = 0
	}
	roomState.State = state.LobbyStandby
	roomState.Started = false
	roomState.WinnerTeam = ""

	return s.store.SetRoomState(roomState)
}

func (s *Service) CheckVictory(roomName string) (state.RoomState, error) {
	roomState, err := s.GetByName(roomName)
	if err != nil {
		return state.RoomState{}, fmt.Errorf("%w, %v", ErrNotFound, err)
	}

	for _, v := range roomState.Teams {
		if v.Score == roomState.ScoreGoal {
			roomState.WinnerTeam = v.Name
			break
		}
	}

	return s.store.SetRoomState(roomState)
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
