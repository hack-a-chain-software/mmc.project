import { GuessInterface } from '@/interfaces';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { useGame } from '@/stores/game';
import { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ModalTemplate } from '../modal-template';
import { GuessItem } from './guess-item';
import { useUser } from '@/stores/user';
import { useModal } from '@/stores/modal';

export type GuessesModalInterface = Partial<BaseModalPropsInterface>;

export const GuessesModal = () => {
  const {
    overlay,
    guesses: isOpen,
    onShowModal,
    onCloseModal,
  } = useModal();

  const { claimGuessRewards, getGuess } = useGame();

  const {
    accountId,
    autenticated,
  } = useUser();

  const [guesses, setGuesses] = useState<GuessInterface[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isOpen);

    if (!accountId || !autenticated || !isOpen) {
      return;
    }

    void (async () => {
      const userGuesses = await getGuess();

      setGuesses((userGuesses || []) as GuessInterface[]);
      setIsLoading(false);
    })();
  }, [accountId, isOpen]);

  const claimRewards = async (guess) => {
    await onShowModal('overlay');

    try {
      await claimGuessRewards(guess);
    } catch (e) {
      console.warn('error', e);
    }

    await onCloseModal('overlay');

    setIsLoading(true);
    const userGuesses = await getGuess();
    setGuesses((userGuesses || []) as GuessInterface[]);
    setIsLoading(false);
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={() => {
        if (overlay) {
          return;
        }

        onCloseModal('guesses');
      }}
      title="My Guesses"
    >
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(263px,262px))] gap-4 justify-center flex-grow max-h-[400px] h-[400px] overflow-auto w-full pb-12"
      >
        {!isLoading && !isEmpty(guesses) && guesses.map((guess, index) => (
          <GuessItem
            {...guess}
            order={index + 1}
            key={guess.id}
            burned={guess.burned}
            claimRewards={() => claimRewards(guess)}
          />
        ))}

        {!isLoading && isEmpty(guesses) && (
          <div
            className="flex items-center justify-center bg-blue h-[300px] col-span-12"
          >
            <span
              className="text-white"
            >
              You haven't made any guesses
            </span>
          </div>
        )}

        {isLoading && (
          <div
            className="flex items-center justify-center h-[300px] w-full col-span-12"
          >
            <svg className="animate-spin h-8 w-8 border border-l-black rounded-full" viewBox="0 0 24 24"/>
          </div>
        )}
      </div>
    </ModalTemplate>
  );
};
