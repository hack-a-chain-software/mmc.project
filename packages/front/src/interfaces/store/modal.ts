import {
  GuessModalInterface,
  GuessesModalInterface,
  GameClueModalInterface,
  CurrencyModalInterface,
  SceneClueModalInterface,
  LockedTokensModalInterface,
  FastPassModalPropsInterface,
  StakeNftModalPropsInterface,
  ConfirmStakeClueModalInterface,
} from '@/modals';

export type Key = 'currency' | 'lockedTokens' | 'fastPass' | 'gameClues' | 'guess' | 'guesses' | 'sceneClue' | 'stakeNft' | 'confirmStakeClue' | 'overlay';

export type ModalProps = GuessModalInterface | GuessesModalInterface | GameClueModalInterface | CurrencyModalInterface | SceneClueModalInterface | FastPassModalPropsInterface | StakeNftModalPropsInterface | LockedTokensModalInterface | ConfirmStakeClueModalInterface;

export interface Props {
  guess?: GuessModalInterface,
  guesses?: GuessesModalInterface,
  currency?: CurrencyModalInterface,
  gameClues?: GameClueModalInterface,
  sceneClue?: SceneClueModalInterface,
  fastPass?: FastPassModalPropsInterface,
  stakeNft?: StakeNftModalPropsInterface,
  lockedTokens?: LockedTokensModalInterface,
  confirmStakeClue?: ConfirmStakeClueModalInterface,
}

export interface ModalStoreInterface {
  currency: boolean,
  lockedTokens: boolean,
  fastPass: boolean,
  gameClues: boolean,
  guess: boolean,
  guesses: boolean,
  sceneClue: boolean,
  stakeNft: boolean,
  overlay: boolean,
  wallet: boolean,
  confirmStakeClue: boolean,
  props: Props,
  onShowModal: (key: Key, props?: ModalProps) => void;
  onCloseModal: (key: Key, reset?: boolean) => Promise<void>;
  toggleOverlay: () => void,
}
