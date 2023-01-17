import { Button } from '..';
import { useState, Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import StakeCard from './stake-card';

const nfts = [
  {
    id: 0,
    image: './images/nft-mock.png',
  },
  {
    id: 1,
    image: './images/nft-mock.png',
  },
  {
    id: 2,
    image: './images/nft-mock.png',
  },
  {
    id: 3,
    image: './images/nft-mock.png',
  },
]

export const StakeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<any[]>([]);

  const handleSelected = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));

      return;
    }

    setSelected([...selected, id]);
  };

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
          <div className="fixed inset-0 bg-black bg-opacity-30" />
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
              <Dialog.Panel className="w-full max-w-[639px] min-h-[443px] transform overflow-hidden bg-white rounded-md transition-all py-4 px-8 text-white space-y-4">
                <div
                  className="flex items-center justify-between"
                >
                  <div className="mr-[12px]]">
                    <span className="uppercase text-xl text-black">
                      Select NFT's
                    </span>
                  </div>


                  <button
                    onClick={() => onClose()}
                    className="
                      h-10 w-10
                      text-black
                      border border-black
                      flex items-center justify-center
                      outline-none
                      hover:bg-black hover:text-white
                    "
                  >
                    <XMarkIcon className="w-12 h-12 text-current" />
                  </button>
                </div>

                <div
                  className="grid grid-cols-[repeat(auto-fill,minmax(173px,173px))] gap-7 justify-center max-h-[300px] overflow-auto"
                >
                  {nfts.map((nft) => (
                    <StakeCard
                      {...nft}
                      key={`stake-modal-nft-${nft.id}`}
                      isSelected={selected.includes(nft.id)}
                      onSelect={() => handleSelected(nft.id)}
                    />
                  ))}
                </div>

                <div
                  className="flex justify-between items-center w-full pt-2.5"
                >
                  <Button
                    onClick={() => onClose()}
                    className="w-[125px] min-h-[30px] h-[30px] text-xs flex justify-center bg-transparent hover:bg-purple-0 hover:text-white border-purple-0 text-purple-0"
                  >
                    Cancel
                  </Button>

                  <Button
                    disabled={true}
                    className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:cursor-not-allowed hover:opacity-80 hover:bg-purple-0 hover:text-white"
                  >
                    Stake
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StakeModal;
