import isEmpty from 'lodash/isEmpty';
import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { Tab } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { ConfirmStakeClueModal } from '@/modals';
import { ClueInterface } from '@/interfaces';
import { ModalTemplate } from '../modal-template';
import { useEffect, useMemo, useState } from 'react';
import { BaseModalPropsInterface } from '@/interfaces/modal';

export interface Clue extends ClueInterface {
	isMinted: boolean;
}

const tabs = ['My Clues', 'All Clues'];

export const GameCluesModal = ({
  isOpen = false,
  onClose,
}: BaseModalPropsInterface) => {
	const [clues, setClues] = useState<Clue[]>([]);
	const [stakeClue, setStakeClue] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [showConfirmStakeModal, setShowConfirmStakeModal] = useState(false);

	const { accountId, jwt, connected, getClues } = useGame();

	useEffect(() => {
		if (!connected || !isOpen || !jwt || !accountId) {
			return;
		}

		void (async () => {
			const allClues = await getClues();

			setClues(allClues as Clue[]);
			setIsLoading(false);
		})();
	}, [connected, isOpen, jwt, accountId]);

	const myClues = useMemo(() => {
		if (!clues) {
			return [];
		}

		return clues.filter((clue) => clue.isOwner);
	}, [clues, isOpen, accountId]);

  return (
    <>
      <ConfirmStakeClueModal
        nft_id={stakeClue}
        isOpen={showConfirmStakeModal}
        onClose={() => setShowConfirmStakeModal(false)}
      />

      <ModalTemplate
        isOpen={isOpen}
        onClose={onClose}
      >
        <Tab.Group
          as="div"
          className="flex flex-col items-center space-y-[32px]"
        >
          <Tab.List className="flex space-x-[32px] rounded-xl p-1 max-w-md w-screen items-center justify-center">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  twMerge(
                    'w-[150px] min-h-[40px] tracking-[0px] rounded-[50px] font-[400] text-sm border border-white outline-none',
                    selected ? 'bg-purple-0' : 'bg-transparent'
                  )
                }
                children={tab}
              />
            ))}
          </Tab.List>

          <Tab.Panels className="mt-2 relative w-full">
            <div className="w-full h-[2px] bg-[#A522FB] mb-[32px]" />

            {isLoading && (
              <div className="flex items-center justify-center h-[300px] w-full">
                <svg
                  className="animate-spin h-8 w-8 border border-l-black rounded-full"
                  viewBox="0 0 24 24"
                />
              </div>
            )}

            {!isLoading && (
              <>
                <Tab.Panel>
                  <div className="flex space-x-[60px] px-[12px]">
                    {!isEmpty(myClues) &&
                      myClues.map(
                        (
                          { media, isMinted, isStaked, nft_id },
                          index
                        ) => (
                          <div
                            key={`myclue-${index}`}
                            className="space-y-[18px] flex flex-col items-center "
                          >
                            <div className="w-[150px] h-[150px] rounded-[15px] flex items-center justify-center">
                              <img
                                src={media}
                                className="max-w-full max-h-full"
                              />
                            </div>

                            <div>
                              <span
                                className={twMerge(
                                  'text-base font-[300] text-white uppercase',
                                  isMinted
                                    ? 'opacity-1'
                                    : 'opacity-[0.35]'
                                )}
                              >
                                Minted
                              </span>
                            </div>

                            <div>
                              <span
                                className={twMerge(
                                  'text-base font-[300] text-white uppercase',
                                  isStaked
                                    ? 'opacity-1'
                                    : 'opacity-[0.35]'
                                )}
                              >
                                Staked
                              </span>
                            </div>

                            {!isStaked && (
                              <div>
                                <Button
                                  onClick={() => {
                                    void setStakeClue(
                                      nft_id as string
                                    );
                                    void setShowConfirmStakeModal(
                                      true
                                    );
                                  }}
                                  className="w-[100px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:pointer-events-none"
                                >
                                  Stake
                                </Button>
                              </div>
                            )}
                          </div>
                        )
                      )}

                    {isEmpty(myClues) && (
                      <div className="w-full flex items-center justify-center bg-blue h-[300px]">
                        <span className="text-white">
                          You don't have Clues
                        </span>
                      </div>
                    )}
                  </div>
                </Tab.Panel>

                <Tab.Panel>
                  <div className="flex space-x-[60px] px-[12px]">
                    {clues &&
                      clues.map(
                        ({ media, isMinted, isStaked }, index) => (
                          <div
                            key={`allclues-${index}`}
                            className="space-y-[18px] flex flex-col items-center "
                          >
                            <div className="w-[150px] h-[150px] rounded-[15px] flex items-center justify-center">
                              <img
                                src={media}
                                className="max-w-full max-h-full"
                              />
                            </div>

                            <div>
                              <span
                                className={twMerge(
                                  'text-base font-[300] text-white uppercase',
                                  !isMinted
                                    ? 'opacity-1'
                                    : 'opacity-[0.35]',
                                )}
                              >
                                Not found
                              </span>
                            </div>

                            <div>
                              <span
                                className={twMerge(
                                  'text-base font-[300] text-white uppercase',
                                  isMinted
                                    ? 'opacity-1'
                                    : 'opacity-[0.35]',
                                )}
                              >
                                Found
                              </span>
                            </div>

                            <div>
                              <span
                                className={twMerge(
                                  'text-base font-[300] text-white uppercase',
                                  isStaked
                                    ? 'opacity-1'
                                    : 'opacity-[0.35]',
                                )}
                              >
                                Revealed
                              </span>
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </Tab.Panel>
              </>
            )}
          </Tab.Panels>
        </Tab.Group>
      </ModalTemplate>
    </>
  );
};
