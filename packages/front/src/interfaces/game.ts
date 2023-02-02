export interface GameConfigInterface {
  created_at: string;
  season_ends_at: string;
  guess_open_at: string;
  guess_questions: GuessQuestionInterface[],
}

export interface GuessQuestionInterface {
  question: string;
  options: Option[];
  guess_column: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface GuessInterface {
  id: string;
  hash: string;
  weapon: string;
  motive: string;
  burned: boolean;
  murdered: string;
  wallet_id: string;
  random_number: string;
  created_at: string;
}
