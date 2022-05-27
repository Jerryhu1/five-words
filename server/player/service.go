package player

import (
	"github.com/jerryhu1/five-words/room/state"
)

type Service struct{}

func NewPlayer(id string, name string) state.Player {
	return state.Player{
		ID:       id,
		Name:     name,
		IsActive: true,
	}
}

func New() *Service {
	return &Service{}
}
