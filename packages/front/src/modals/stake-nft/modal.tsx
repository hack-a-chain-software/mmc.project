import Big from 'big.js';
import StakeNftCard from './card';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { viewFunction } from '@/helpers/near';
import { ModalTemplate } from '../modal-template';
import { useState, useEffect, useMemo } from 'react';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { GameCurrencyInterface, Token } from '@/interfaces';
import { useWalletSelector } from '@/context/wallet';
import { gameContract } from '@/constants/env';

export interface Selected extends Token {
  contract: string;
}

export interface StakeNftModalPropsInterface extends BaseModalPropsInterface {
  isMulti?: boolean;
  buttonText?: string;
  onStake: (selected: Selected[]) => Promise<void>,
  fetchTokens: () => Promise<Selected[]>
}

export const StakeNftModal = ({
  isOpen,
  currency,
  fetchTokens,
  isMulti = true,
  onClose = () => {},
  buttonText = 'Stake',
  title = "Select NFT's",
  onStake = async () => {},
}: Partial<StakeNftModalPropsInterface> & {
  currency: GameCurrencyInterface | null;
}) => {
  const [price, setPrice] = useState('');
  const [tokens, setTokens] = useState<Selected[]>([]);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { accountId } = useGame();

  const {
    selector,
  }  = useWalletSelector();

  const decimals = useMemo(() => {
    return new Big(10).pow(currency?.metadata?.decimals ?? 0);
  }, [currency]);

  const formattedPrice = useMemo(() => {
    return new Big(price || 0).div(decimals).toFixed(2);
  }, [currency, decimals]);

  useEffect(() => {
    if (!currency) {
      return;
    }

    void (async () => {
      const res = await viewFunction(
        selector,
        gameContract,
        'view_price',
        {
          currency: currency?.contract,
        },
      );

      setPrice(res as string);
    })();

  }, [currency]);

  useEffect(() => {
    if (!accountId || !isOpen || !fetchTokens) {
      return;
    }

    void (async () => {
      const userTokens = await fetchTokens();

      setIsLoading(false);

      setTokens(userTokens);
    })();
  }, [accountId, isOpen]);

  const onSelect = (newValue: Selected) => {
    const hasEqualValue = selected.findIndex(
      item => isEqual(item, newValue),
    ) !== -1;

    if (hasEqualValue) {
      setSelected(selected.filter(item => !isEqual(item, newValue)));

      return;
    }

    if (!isMulti) {
      setSelected([newValue]);

      return;
    }

    setSelected([...selected, newValue]);
  };

  return (
    <ModalTemplate
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[639px] min-h-[443px] transform overflow-hidden bg-white rounded-md transition-all py-4 px-8 text-black space-y-4"
    >
      {!isLoading && !isEmpty(tokens) && (
        <div
          className="grid grid-cols-[repeat(auto-fill,minmax(173px,173px))] gap-7 justify-center max-h-[300px] overflow-auto min-h-[300px]"
        >
          {tokens.map((nft, index) => (
            <StakeNftCard
              id={`${nft.token_id as string}`}
              image={nft.metadata.media as string}
              title={nft.metadata.title as string}
              isSelected={selected.findIndex(item => (
                item.contract === nft.contract
                && item.token_id === nft.token_id
              )) !== -1}
              onSelect={() => onSelect({ ...nft })}
              key={`stake-modal-nft-${nft.token_id as string}-${index}`}
            />
          ))}
        </div>
      )}

      {isLoading && (
        <div
          className="flex items-center justify-center h-[300px] w-full"
        >
          <svg className="animate-spin h-8 w-8 border border-l-black rounded-full" viewBox="0 0 24 24"/>
        </div>
      )}

      {!isLoading && isEmpty(tokens) && (
        <div
          className="flex items-center justify-center bg-blue h-[300px]"
        >
          <span
            className="text-black"
          >
            You don't have NFT's to stake
          </span>
        </div>
      )}

      {!isLoading && !isEmpty(tokens) && (
        <div
          className="flex justify-between items-center w-full pt-2.5"
        >
          <Button
            onClick={() => onClose()}
            className="w-[125px] min-h-[30px] h-[30px] text-xs flex justify-center bg-transparent hover:bg-purple-0 hover:text-white border-purple-0 text-purple-0"
          >
            Cancel
          </Button>

          <div
            className="flex items-center space-x-2"
          >
            {currency && !isEmpty(selected) && (
              <div>
                <span
                  children={`Price: ${formattedPrice as string} ${currency?.metadata.symbol as string}`}
                  className="text-sm"
                />
              </div>
            )}

            <Button
              children={buttonText}
              disabled={isEmpty(selected)}
              onClick={() => void onStake(selected)}
              className="min-w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:cursor-not-allowed hover:opacity-80 hover:bg-purple-0 hover:text-white"
            />
          </div>
        </div>
      )}
    </ModalTemplate>
  );
};
