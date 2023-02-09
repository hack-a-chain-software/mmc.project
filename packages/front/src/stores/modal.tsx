import { create } from 'zustand';
import { ModalStoreInterface } from '@/interfaces';

export const defaultValues = {
  currency: false,
  lockedTokens: false,
  fastPass: false,
  gameClues: false,
  guess: false,
  guesses: false,
  sceneClue: false,
  stakeNft: false,
  wallet: false,
  confirmStakeClue: false,
  overlay: false,

  props: {},
};

export const useModal = create<ModalStoreInterface>((set, get) => ({
  ...defaultValues,

  onShowModal: (key, modalProps) => {
    const {
      props,
    } = get();
    set(() => ({
      props: {
        ...props,
        [key]: modalProps,
      },
      [key]: true,
    }));
  },

  onCloseModal: (key, reset = false) => {
    set(() => ({
      [key]: false,
    }));

    return new Promise((resolve) => {
      if (!reset) {
        setTimeout(resolve, 200);
      }

      void (() => {
        setTimeout(() => {
          set(() => ({ ...defaultValues }));

          resolve();
        }, 200);
      })();
    });
  },

  toggleOverlay: () => {
    const {
      overlay,
    } = get();

    set(() => ({
      overlay: !overlay,
    }));
  },
}));
