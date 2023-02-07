import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { ClueInterface } from '@/interfaces';
import { ModalTemplate } from '../modal-template';
import { useWalletSelector } from '@/context/wallet';
import { BaseModalPropsInterface } from '@/interfaces/modal';

export const ConfirmStakeClueModal = ({
  nft_id,
  onClose,
  isOpen = false,
}: Partial<BaseModalPropsInterface> & Partial<ClueInterface>) => {
  const { selector } = useWalletSelector();

  const { accountId, stakeClue } = useGame();

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
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
          selector,
        )}
        className="w-[185px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto hover:border-purple-0"
      >
        Stake now
      </Button>
    </ModalTemplate>
  );
};
