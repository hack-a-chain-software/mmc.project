import { twMerge } from 'tailwind-merge';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { useModal } from '@/stores/modal';
import { useUser } from '@/stores/user';
import { useGame } from '@/stores/game';
import { toast } from 'react-hot-toast';

const explorer = {
  mainnet: 'https://explorer.near.org/transactions/',
  testnet: 'https://explorer.testnet.near.org/transactions/',
};

export const Toast = ({
  visible,
  status,
  message,
  transactionHash,
}: {
  visible: boolean;
  status: string;
  message: string;
  transactionHash: string | undefined;
}) => {
  const {
    onShowModal,
  } = useModal();

  const {
    accountId,
  } = useUser();

  const {
    scene,
  } = useGame();

  useEffect(() => {
    if (!accountId || !scene) {
      return;
    }

    setTimeout(() => {
      onShowModal('gameClues');
    }, 800);
  }, [message, accountId, scene]);

  useEffect(() => {
    if (status === 'success') {
      toast.success(message);

      return;
    }
  });
};
