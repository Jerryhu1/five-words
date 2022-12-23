package card

import (
	"embed"
	"encoding/json"
	"math/rand"
	"strings"

	"github.com/jerryhu1/five-words/util/slice"
)

type Service struct {
	words []Word
}

func (s Service) GetRandomCard() Card {
	var card Card
	var prev []int
	for i := 0; i < 5; i++ {
		idx := rand.Intn(len(s.words))
		for slice.Contains(prev, idx) {
			idx = rand.Intn(len(s.words))
		}
		prev = append(prev, idx)
		card.Words = append(card.Words, s.words[idx])
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

var wordsFile embed.FS

func NewService(wordsFilePath string) (Service, error) {
	file, err := wordsFile.ReadFile(wordsFilePath)
	if err != nil {
		return Service{}, err
	}

	var payload payload

	err = json.Unmarshal(file, &payload)
	if err != nil {
		return Service{}, err
	}

	words := make([]Word, 0, len(payload.Words))
	for _, w := range payload.Words {
		words = append(words, Word{ID: "0", Text: w, Correct: false})
	}

	return Service{words: words}, nil
}
