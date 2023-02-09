import isEmpty from 'lodash/isEmpty';
import { Button } from '@/components';
import { useUser } from '@/stores/user';
import { Tab } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { ClueInterface } from '@/interfaces';
import { ModalTemplate } from '../modal-template';
import { useMemo } from 'react';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { useGame } from '@/stores/game';
import { useModal } from '@/stores/modal';

export interface Clue extends ClueInterface {
	isMinted: boolean;
}

const tabs = ['My Clues', 'All Clues'];

export type GameClueModalInterface = Partial<BaseModalPropsInterface>;

export const GameCluesModal = () => {
  const {
    gameClues,
    onCloseModal,
    onShowModal,
  } = useModal();

  const {
    clues,
    myClues,
  } = useGame();

  const isLoading = useMemo(() => {
    return !myClues || !clues;
  }, [myClues, clues]);

  return (
    <ModalTemplate
      isOpen={gameClues}
      onClose={() => onCloseModal('gameClues')}
      isLoading={isLoading}
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
                  selected ? 'bg-purple-0' : 'bg-transparent',
                )
              }
              children={tab}
            />
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2 relative w-full">
          <div className="w-full h-[2px] bg-[#A522FB] mb-[32px]" />
            <Tab.Panel>
              <div className="
                grid grid-cols-[repeat(auto-fill,minmax(150px,150px))] gap-12 justify-center flex-grow max-h-[400px] h-[400px] overflow-auto
              ">
                {!isEmpty(myClues) &&
                  myClues.map(
                    (
                      { media, isMinted, isStaked, nft_id },
                      index,
                    ) => (
                      <div
                        key={`myclue-${index as number}`}
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
                              isMinted && !isStaked
                                ? 'opacity-1'
                                : 'opacity-[0.35]',
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
                                : 'opacity-[0.35]',
                            )}
                          >
                            Staked
                          </span>
                        </div>

                        {!isStaked && (
                          <div>
                            <Button
                              onClick={async () => {
                                await onShowModal('confirmStakeClue', { nft_id });
                              }}
                              className="w-[100px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:pointer-events-none"
                            >
                              Stake
                            </Button>
                          </div>
                        )}
                      </div>
                    ),
                  )}

                {isEmpty(myClues) && (
                  <div className="col-span-full flex items-center justify-center bg-blue h-[300px]">
                    <span className="text-white">
                      You don't have Clues
                    </span>
                  </div>
                )}
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="
                grid grid-cols-[repeat(auto-fill,minmax(150px,150px))] gap-12 justify-center flex-grow max-h-[400px] h-[400px] overflow-auto
              ">
                {clues &&
                  clues.map(
                    ({ media, isMinted, isStaked }, index) => (
                      <div
                        key={`allclues-${index as number}`}
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
                              isMinted && !isStaked
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
                    ),
                  )}
              </div>
            </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </ModalTemplate>
  );
};
