import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { ClueInterface } from '@/interfaces';
import { ModalTemplate } from '../modal-template';
// import { useWalletSelector } from '@/context/wallet';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { useWallet } from '@/stores/wallet';
import { useModal } from '@/stores/modal';
import { useMemo } from 'react';

export type ConfirmStakeClueModalInterface = Partial<BaseModalPropsInterface>
  & Partial<ClueInterface>;

export const ConfirmStakeClueModal = () => {
  const {
    props,
    onCloseModal,
    confirmStakeClue,
  } = useModal();

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    nft_id = '',
  } = useMemo(
    () => props.confirmStakeClue as ConfirmStakeClueModalInterface || {},
    [props],
  );

  const { stakeClue } = useGame();

  const { selector, accountId } = useWallet();

  return (
    <ModalTemplate
      isOpen={confirmStakeClue}
      onClose={() => onCloseModal('confirmStakeClue')}
      title="Stake Clue"
      className="max-w-xl text-black bg-white rounded-md"
    >
      <div className="text-sm">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </span>
      </div>

      <div className="text-sm">
        <span>To agree to these terms please select “OK”.</span>
      </div>

      <Button
        onClick={() => void stakeClue(
          nft_id as string,
          accountId,
          selector as any,
        )}
        className="w-[185px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto hover:border-purple-0"
      >
        Stake now
      </Button>
    </ModalTemplate>
  );
};
