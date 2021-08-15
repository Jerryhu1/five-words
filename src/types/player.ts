export interface Player {
  id: string;
  name: string;
  teamID: string;
  isActive: boolean;
}

export interface Team {
  id: string;
  name: string;
  players: string[];
  score: number;
  cards: number[];
  currExplainer: string;
}