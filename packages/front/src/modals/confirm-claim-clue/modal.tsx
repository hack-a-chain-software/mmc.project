import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { ClueInterface } from '@/interfaces';
import { ModalTemplate } from '../modal-template';
import { useWalletSelector } from '@/context/wallet';
import { BaseModalPropsInterface } from '@/interfaces/modal';

export const ConfirmClaimClueModal = ({
  nft_id,
  onClose,
  isOpen = false,
}: Partial<BaseModalPropsInterface> & Partial<ClueInterface>) => {
  const {
    selector,
    accountId,
  } = useWalletSelector();

  const { claimClue } = useGame();

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl"
      title="By mint this clue:"
    >
      <div className="text-sm">
        <span>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna
          aliqua.
        </span>
      </div>

      <div className="pb-[27px] text-sm">
        <span>To agree to these terms please select “OK”.</span>
      </div>

      <Button
        onClick={() => {
          if (!accountId) {
            return;
          }

          void claimClue(
            nft_id as string,
            accountId,
            selector,
          );
        }}
        className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
      >
        Mint now
      </Button>
    </ModalTemplate>
  );
};
