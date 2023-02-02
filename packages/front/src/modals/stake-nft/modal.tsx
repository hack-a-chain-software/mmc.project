import StakeNftCard from './card';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { Button } from '@/components';
import { useGame } from '@/stores/game';
import { ModalTemplate } from '../modal-template';
import { useState, useEffect } from 'react';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { Token } from '@/interfaces';

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
  onClose,
  onStake,
  fetchTokens,
  isMulti = true,
  buttonText = 'Stake',
}: StakeNftModalPropsInterface) => {
  const [tokens, setTokens] = useState<Selected[]>([]);
  const [selected, setSelected] = useState<Selected[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { accountId } = useGame();

  useEffect(() => {
    if (!accountId || !isOpen) {
      return;
    }

    void (async () => {
      const userTokens = await fetchTokens();

      setIsLoading(false);

      setTokens(userTokens);
    })();
  }, [accountId, isOpen]);

  const onSelect = (newValue: Selected) => {
    if (!isMulti) {
      setSelected([newValue]);

      return;
    }

    const hasEqualValue = selected.findIndex(
      item => isEqual(item, newValue),
    ) !== -1;

    if (hasEqualValue) {
      setSelected(selected.filter(item => !isEqual(item, newValue)));

      return;
    }

    setSelected([...selected, newValue]);
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[639px] min-h-[443px] transform overflow-hidden bg-white rounded-md transition-all py-4 px-8 text-white space-y-4"
    >
      <div className="mr-[12px]">
        <span className="uppercase text-xl text-black">
          Select NFT's
        </span>
      </div>

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
              onSelect={() => onSelect({...nft as Selected})}
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

          <Button
            children={buttonText}
            disabled={isEmpty(selected)}
            onClick={() => void onStake(selected)}
            className="min-w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:cursor-not-allowed hover:opacity-80 hover:bg-purple-0 hover:text-white"
          />
        </div>
      )}
    </ModalTemplate>
  );
};
