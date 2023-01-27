import { Button, GameConfig, Select } from '..';
import { Fragment, useCallback, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { useWalletSelector } from '@/context/wallet';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
// import { viewFunction } from '@/helpers/near';

const defaultGuess = {
  weapon: '',
  motive: '',
  who_murdered: '',
};

export interface GuessInterface {
  weapon: string;
  motive: string;
  who_murdered: string;
}

export function GuessingForm({
	isOpen,
  config,
	onClose,
}: {
  config: GameConfig;
	isOpen: boolean;
	onClose: () => void;
}) {
  const [guess, setGuess] = useState<GuessInterface>({ ...defaultGuess });

  const { selector, jwt } = useWalletSelector();

  const sendGuess = useCallback(async () => {
    if ( !guess.weapon || !guess.motive || !guess.who_murdered) {
      toast.error('You must fill in all the answers.');

      return;
    }
    // TODO: Get guess hash

    // const randomNumber = Date.now();
    // const guessHas = viewFunction(
    //   selector,
    //   import.meta.env.VITE_CLUES_CONTRACT,
    //   'create_hash',
    //   {
    //     random_number: randomNumber,
    //   },
    // );

    const guessHas = 'arroizcomefeijaotalvezsejabom';

    try {
      await api.post('game/guess', {
        hash: guessHas,
        random_number: 1234,
        ...guess,
      }, {
        headers: { Authorization: `Bearer ${jwt as string}` },
      });

      toast.success('Your guess has been successfully saved!');
      setGuess({ ...defaultGuess });
      onClose();

    } catch (e) {
      console.warn(e);
      toast.error('Something happens when saving your guess, please refresh your browser.');
    }
  }, [jwt, guess]);

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-[999999]"
				onClose={() => onClose()}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white">
                <div
                  className="flex items-center justify-between pb-[45px]"
                >
                  <div className="mr-[12px]]">
                    <span className="uppercase text-xl">
                      Ready to guess?
                    </span>
                  </div>


                  <button
                    onClick={() => onClose()}
                    className="
                      h-10 w-10
                      text-white
                      border border-white
                      flex items-center justify-center
                      outline-none
                      hover:bg-white hover:text-black
                    "
                  >
                    <XMarkIcon className="w-12 h-12 text-current" />
                  </button>
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
                  onClick={() => { void sendGuess(); }}
									className="w-[125px] flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
								>
									Submit
								</Button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default GuessingForm;
