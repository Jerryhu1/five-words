export interface Word {
  id: string;
  text: string;
  correct: boolean;
}

export interface Card {
  id: string;
  words: Word[];
  correct: number;
}
