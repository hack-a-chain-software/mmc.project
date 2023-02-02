import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ModalTemplate } from '../modal-template';
import { Button, Select } from '@/components';
import { useCallback, useState } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { useGame } from '@/stores/game';
import { GuessInterface, GameConfigInterface } from '@/interfaces';
import { GuessDto } from '@/stores/game';

const defaultGuess = {
  weapon: '',
  motive: '',
  murdered: '',
};

export const GuessFormModal = ({
  config,
  isOpen,
  onClose,
}: BaseModalPropsInterface & { config: GameConfigInterface }) => {
  const [guess, setGuess] = useState<Partial<GuessInterface>>({
    ...defaultGuess,
  });

  const { selector } = useWalletSelector();
  const { jwt, sendGuess, accountId } = useGame();

  const send = useCallback(async () => {
    await sendGuess(guess as GuessDto, accountId, selector);
    setGuess({ ...defaultGuess });
    onClose();
  }, [jwt, guess]);

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white"
    >
      <div
        className="w-full"
      >
        <div className="mr-[12px] pb-[45px]">
          <span className="uppercase text-xl">
            Ready to guess?
          </span>
        </div>

        {config && config.guess_questions.map((
          { question, guess_column, options },
        ) => (
          <div
            className="pb-[20px] w-full"
            key={`guessing-question-${guess_column as string}`}
          >
            <div>
              <span
                className="text-base uppercase"
                children={question}
              />
            </div>

            <Select
              value={guess[guess_column]}
              items={options}
              onChange={(value) =>
                void setGuess({ ...guess, [guess_column]: value })
              }
              placeholder="SELECT"
            />
          </div>
        ))}

        <div className="pb-[24px] text-xs">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore
            et dolore magna aliqua.
          </span>
        </div>

        <div className="pb-[49px] text-xs">
          <span>
            If you agree to the above please select “SUBMIT”.
          </span>
        </div>

        <Button
          // disabled={true}
          onClick={() => { void send(); }}
          className="w-[125px] flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
        >
          Submit
        </Button>
      </div>
    </ModalTemplate>
  );
};

export default GuessFormModal;
