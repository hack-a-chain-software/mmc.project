import { GuessInterface } from '@/interfaces';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { useGame } from '@/stores/game';
import { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { ModalTemplate } from '../modal-template';
import { GuessItem } from './guess-item';
import { Button } from '@/components';
import { useUser } from '@/stores/user';
import { useModal } from '@/stores/modal';

export type GuessesModalInterface = Partial<BaseModalPropsInterface>;

export const GuessesModal = () => {
  const {
    guesses: isOpen,
    onShowModal,
    onCloseModal,
  } = useModal();

  const { claimAllGuessingRewards, getGuess } = useGame();
  const {
    accountId,
    autenticated,
  } = useUser();

  const [guesses, setGuesses] = useState<GuessInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!accountId || !autenticated || !isOpen) {
      return;
    }

    void (async () => {
      const userGuesses = await getGuess();

      setGuesses((userGuesses || []) as GuessInterface[]);
      setIsLoading(false);
    })();
  }, [accountId, isOpen]);

  const allGuessingIsBurned = useMemo(() => {
    return guesses.every((guess) => guess.burned);
  }, [guesses]);

  const claimAll = async () => {
    onShowModal('overlay');

    await claimAllGuessingRewards();

    onCloseModal('overlay');
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={() => onCloseModal('guesses')}
      title="My Guesses"
    >
      <div
        className="flex flex-col max-h-[420px] overflow-auto w-full space-y-2"
      >
        {!isLoading && !isEmpty(guesses) && (
          <div
            className="grid grid-cols-12 max-w-full gap-2"
          >
            <div
              className="col-span-2 overflow-hidden text-left"
            >
              <span
                className="text-xs font-bold"
              >
                Murdered
              </span>
            </div>

            <div
              className="col-span-3 overflow-hidden text-left"
            >
              <span
                className="text-xs font-bold"
              >
                Weapon
              </span>
            </div>

            <div
              className="col-span-4 overflow-hidden text-left"
            >
              <span
                className="text-xs font-bold"
              >
                Motive
              </span>
            </div>

            <div
              className="col-span-2 overflow-hidden text-left"
            >
              <span
                className="text-xs font-bold"
              >
                Created At
              </span>
            </div>

            <div
              className="col-span-1 overflow-hidden text-left"
            >
              <span
                className="text-xs font-bold"
              >
                Claimed
              </span>
            </div>
          </div>
        )}

        {!isLoading && !isEmpty(guesses) && guesses.map((guess, index) => (
          <GuessItem
            {...guess}
            order={index + 1}
            key={guess.id}
          />
        ))}

        {!isLoading && isEmpty(guesses) && (

          <div
            className="flex items-center justify-center bg-blue h-[300px]"
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
            className="flex items-center justify-center h-[300px] w-full"
          >
            <svg className="animate-spin h-8 w-8 border border-l-black rounded-full" viewBox="0 0 24 24"/>
          </div>
        )}
      </div>

      <div
        className="pt-8 flex items-center"
      >
        <div
          className="flex-grow flex justify-center mr-8"
        >
          {!isLoading && !allGuessingIsBurned && !isEmpty(guesses) && (
            <Button
              onClick={() => claimAll()}
              disabled={allGuessingIsBurned && isEmpty(guesses)}
              className="disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span>Claim all guessing rewards</span>
            </Button>
          )}
        </div>
      </div>
    </ModalTemplate>
  );
};
