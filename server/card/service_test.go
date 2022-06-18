package card

import (
	"testing"
)

func TestService_CheckWord(t *testing.T) {
	type args struct {
		card Card
		word string
		want Card
	}
	tests := []struct {
		name string
		args args
	}{
		{
			name: "word checked must have correct true after evaluated",
			args: args{
				word: "Schnuki",
				card: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: false,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: false,
					},
				}},
				want: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: true,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: false,
					},
				}},
			},
		},
		{
			name: "case insensitive word checked must have correct true after evaluated",
			args: args{
				word: "simba",
				card: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: false,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: false,
					},
				}},
				want: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: false,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: true,
					},
				}},
			},
		},
		{
			name: "word checked must have correct false after evaluated",
			args: args{
				word: "Gen",
				card: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: false,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: false,
					},
				}},
				want: Card{Words: []Word{
					{
						ID:      "0",
						Text:    "Schnuki",
						Correct: false,
					},
					{
						ID:      "1",
						Text:    "Simba",
						Correct: false,
					},
				}},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			CheckWord(tt.args.card, tt.args.word)
		})
	}
}

func TestService_GetRandomCard(t *testing.T) {
	type fields struct {
		wordStore []Word
	}

	wordStore := []Word{
		{
			ID:      "0",
			Text:    "Schnuki",
			Correct: false,
		},
		{
			ID:      "1",
			Text:    "Simba",
			Correct: false,
		},
		{
			ID:      "2",
			Text:    "Gen",
			Correct: false,
		},
		{
			ID:      "3",
			Text:    "Miso",
			Correct: false,
		},
		{
			ID:      "4",
			Text:    "Zuko",
			Correct: false,
		},
		{
			ID:      "5",
			Text:    "Sneezy",
			Correct: false,
		},
		{
			ID:      "6",
			Text:    "Yuki",
			Correct: false,
		},
	}

	tests := []struct {
		name     string
		evalFunc func(Card) bool
	}{
		{
			name: "must generate a card with five unique words from the wordstore",
			evalFunc: func(card Card) bool {
				var occurs int
				unique := true
				for _, v := range card.Words {
					for _, v2 := range card.Words {
						if v == v2 {
							occurs++
						}
					}
					if occurs > 1 {
						unique = false
					}

					occurs = 0
				}

				return len(card.Words) == 5 && unique
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				wordStore: wordStore,
			}

			got := s.GetRandomCard()
			if !tt.evalFunc(got) {
				t.Errorf("GetRandomCard() = %+v", got)
			}
		})
	}
}
