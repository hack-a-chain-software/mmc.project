export interface GameConfigInterface {
  created_at: string;
  season_ends_at: string;
  guess_available_at: string;
  guess_questions: GuessQuestionInterface[];
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
