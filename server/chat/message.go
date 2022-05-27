package chat

import "time"

type Chat struct {
	Timestamp  time.Time `json:"timestamp"`
	Text       string    `json:"text"`
	PlayerID   string    `json:"playerID"`
	PlayerName string    `json:"playerName"`
}
