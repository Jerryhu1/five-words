package card

import (
	"encoding/json"
	haikunator "github.com/atrox/haikunatorgo/v2"
	"github.com/jerryhu1/five-words/util/slice"
	"math/rand"
	"os"
	"strings"
)

type Service struct {
	nameGen   *haikunator.Haikunator
	wordStore []Word
}

func (s *Service) GetRandomCard() Card {
	var card Card
	var prev []int
	for i := 0; i < 5; i++ {
		idx := rand.Intn(len(s.wordStore))
		for slice.Contains[int](prev, idx) {
			idx = rand.Intn(len(s.wordStore))
		}
		prev = append(prev, idx)
		card.Words = append(card.Words, s.wordStore[idx])
	}

	return card
}

func CheckWord(card Card, word string) (Card, bool) {
	var correct bool
	for i := range card.Words {
		if strings.EqualFold(card.Words[i].Text, word) {
			card.Words[i].Correct = true
			correct = true
		}
	}

	return card, correct
}

type payload struct {
	Words []string `json:"words"`
}

func NewService() (*Service, error) {
	h := haikunator.New()
	h.TokenLength = 0
	file, err := os.ReadFile("./card/data/words-simply.json")
	if err != nil {
		return nil, err
	}

	var payload payload

	err = json.Unmarshal(file, &payload)
	if err != nil {
		return nil, err
	}

	words := make([]Word, 0, len(payload.Words))
	for _, w := range payload.Words {
		words = append(words, Word{ID: "0", Text: w, Correct: false})
	}

	return &Service{nameGen: h, wordStore: words}, nil
}
