import Big from 'big.js';
import { useMemo } from 'react';
import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { ModalTemplate } from '../modal-template';
import { useWalletSelector } from '@/context/wallet';
import { FungibleTokenMetadata } from '@/interfaces';
import { BaseModalPropsInterface } from '@/interfaces/modal';

export interface FastPassModalPropsInterface {
  token: FungibleTokenMetadata;
  isOpen: boolean;
  acceleration: number;
  vestingId: string;
  totalAmount: string;
  passCost: string;
}


export const FastPassModal = ({
  token,
  passCost,
  vestingId,
  totalAmount,
  acceleration,
  isOpen = false,
  onClose,
}: Partial<BaseModalPropsInterface> & FastPassModalPropsInterface) => {
  const { accountId, selector } = useWalletSelector();

  const { buyFastPass } = useGame();

  const decimals = useMemo(() => {
    return new Big(10).pow(token?.decimals ?? 0);
  }, [token]);

  const formattedTotal = useMemo(() => {
    return new Big(totalAmount ?? 0).mul(0.05).div(decimals).toFixed(2);
  }, [totalAmount, token]);

  const buy = async () => {
    if (!accountId) {
      return;
    }

    void await buyFastPass(
      vestingId,
      totalAmount?.toString() || '',
      passCost?.toString() || '',
      accountId,
      selector,
    );
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title="Buy Fast Pass!"
      className="max-w-md text-black bg-white rounded-md"
    >
      <div className="text-sm">
        <span>
          With the fast pass, your vesting period is reduced and you
          get your locked tokens faster
        </span>
      </div>

      <div className="text-sm">
        <span>Time decrease:{
          (-100 / acceleration+100).toFixed(0)
        }%</span>
      </div>

      <div className="text-sm">
        Price: {formattedTotal} {token?.symbol}
      </div>

      <Button
        onClick={() => void buy()}
        className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed hover:border-purple-0 uppercase mx-auto"
      >
        Buy Now!
      </Button>
    </ModalTemplate>
  );
};
