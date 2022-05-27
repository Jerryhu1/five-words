package card

import (
	haikunator "github.com/atrox/haikunatorgo/v2"
	"testing"
)

func TestService_checkWord(t *testing.T) {
	type fields struct {
		nameGen *haikunator.Haikunator
	}
	type args struct {
		card *Card
		word string
	}
	tests := []struct {
		name   string
		fields fields
		args   args
	}{
		// TODO: Add test cases.
		{
			name: "should have word correct",
			args: args{
				card: &Card{Words: []Word{{ID: "1", Text: "coffee", Correct: false}}},
				word: "coffee",
			},
		},
		{
			name: "should have word correct ignoring case",
			args: args{
				card: &Card{Words: []Word{{ID: "1", Text: "coffee", Correct: false}}},
				word: "COFFEE",
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &Service{
				nameGen: tt.fields.nameGen,
			}

			s.CheckWord(tt.args.card, tt.args.word)
			if !tt.args.card.Words[0].Correct {
				t.FailNow()
			}
		})
	}
}
