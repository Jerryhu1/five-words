package state

import "github.com/jerryhu1/five-words/card"

type RoomState struct {
	Name          string             `json:"name"`
	Owner         string             `json:"owner"`
	Players       map[string]*Player `json:"players"`
	Teams         map[string]*Team   `json:"teams"`
	ScoreGoal     int                `json:"scoreGoal"`
	TeamTurn      string             `json:"teamTurn"`
	CurrentCard   *card.Card         `json:"currentCard"`
	Timer         int                `json:"timer"`
	Started       bool               `json:"started"`
	State         State              `json:"state"`
	CurrExplainer string             `json:"currExplainer"`
	Settings      Settings           `json:"settings"`
	WinnerTeam    string             `json:"winnerTeam"`
}

type State string

type Settings struct {
	ScoreGoal int
	Language  string
	RoundTime int
}

const (
	LobbyStandby  State = "LOBBY_STANDBY"
	RoundStarting State = "ROUND_STARTING"
	RoundOngoing  State = "ROUND_ONGOING"
	RoundEnd      State = "ROUND_END"
	GameOver      State = "GAME_OVER"
)

type Player struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	IsActive bool   `json:"isActive"`
}

type Team struct {
	ID            string   `json:"id"`
	Name          string   `json:"name"`
	Score         int      `json:"score"`
	CurrExplainer string   `json:"currExplainer"`
	Players       []string `json:"players"`
}
