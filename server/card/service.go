package card

import (
	haikunator "github.com/atrox/haikunatorgo/v2"
	"strings"
)

type Service struct {
	nameGen *haikunator.Haikunator
}

func (s *Service) GetRandomCard() Card {
	return Card{
		//TODO: Get from word store
		Words: []Word{
			{
				ID:   "1",
				Text: s.nameGen.Haikunate(),
			},
			{
				ID:   "2",
				Text: s.nameGen.Haikunate(),
			},
			{
				ID:   "3",
				Text: s.nameGen.Haikunate(),
			},
			{
				ID:   "4",
				Text: s.nameGen.Haikunate(),
			},
			{
				ID:   "5",
				Text: s.nameGen.Haikunate(),
			},
		},
	}
}

func (s *Service) CheckWord(card *Card, word string) {
	for i := range card.Words {
		if strings.EqualFold(card.Words[i].Text, word) {
			card.Words[i].Correct = true
		}
	}
}

func NewService() *Service {
	h := haikunator.New()
	h.TokenLength = 0
	return &Service{nameGen: h}
}
