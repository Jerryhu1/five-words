package card

type Card struct {
	Words []Word `json:"words"`
}

type Word struct {
	ID      string `json:"id"`
	Text    string `json:"text"`
	Correct bool   `json:"correct"`
}
