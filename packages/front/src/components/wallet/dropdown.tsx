import { Fragment } from 'react';
import { Button } from '../button';
import { Menu, Transition } from '@headlessui/react';
import { useWalletSelector } from '@/utils/context/wallet';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { DocumentDuplicateIcon, ChevronDownIcon, PowerIcon } from '@heroicons/react/24/outline';

const shortenAddress = (address: string, chars = 8): string =>
  `${address.slice(0, chars)}...${address.slice(-chars)}`;

export const WalletDropdown = () => {
  const { accountId, toggleModal, signOut } = useWalletSelector();

  if (!!!accountId) {
    return (
      <Button
        onClick={() => {
          toggleModal();
        }} className="hidden md:flex"
      >
        <span>Connect Wallet</span>
      </Button>
    );
  }

  return (
    <Menu as="div" className="relative text-left hidden md:inline-block">
      <Menu.Button as="div">
        <Button>
          <span children={shortenAddress(accountId)} />
        </Button>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className="
            absolute
            right-0
            mt-2 w-[200px]
            origin-top-right
            rounded-[16px]
            bg-white
            shadow-[0px_4px_30px_rgba(0,0,0,0.25)]
            focus:outline-none
          "
        >
          <div>
            <button
              onClick={() => signOut()}
              className="pt-[19px] px-[24px] pb-[21px] w-full rounded-b-[16px] hover:bg-[#DB2B1F]/[0.65] flex items-center space-x-[8px] text-[#DB2B1F] hover:text-white"
            >
              <PowerIcon
                className="w-[14px]"
              />

              <span className="font-[400] text-[14px]">Disconnect</span>
            </button>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default WalletDropdown;
