import { Selected } from '@/modals';
import { useGame } from '@/stores/game';
import { StakeNftModal } from '@/modals';
import { viewFunction } from '@/helpers/near';
import { GameCurrencyInterface } from '@/interfaces';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { tokenContract } from '@/constants/env';
import { useWallet } from '@/stores/wallet';
import { useUser } from '@/stores/user';

export const BuyTickets = forwardRef((_, ref) => {
  const { selector } = useWallet();

  const [isOpen, setIsOpen] = useState(false);

  const {
    config,
  } = useGame();

  const toggleBuyTicketsModal = () => {
    setIsOpen(true);
  };

  useImperativeHandle(ref, () => ({
    toggleBuyTicketsModal,
  }));

	const {
		getStakedNftsById,
		buyTicketsWithTokens,
	} = useGame();

  const {
    accountId,
  } = useUser();

  const currency = useMemo(() => {
    return config?.currencies.find(({ contract }) =>
      contract === tokenContract,
    ) as GameCurrencyInterface;
  }, [config]);

  const onStake = async (selected: Selected[]) => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_id,
      contract,
    } = selected[0];

    void await buyTicketsWithTokens(
      token_id,
      contract,
      currency,
      accountId,
      selector as any,
    );
  };

  const fetchTokens = async () => {
    if (!accountId) {
      return [];
    }

    const stakedNfts = await getStakedNftsById(accountId, selector as any);

    const tokens: Selected[] = await Promise.all(
      stakedNfts.map(async ([contract, tokenId]) => {
        const token = await viewFunction(
          selector,
          contract,
          'nft_token',
          {
            token_id: tokenId,
          },
        );

        return ({
          ...token,
          contract,
        });
      }),
    );

    return tokens;
  };

  return (
    <StakeNftModal
      isOpen={isOpen}
      isMulti={false}
      onStake={onStake}
      currency={currency}
      buttonText={'Buy Ticket'}
      fetchTokens={fetchTokens}
      title={"Select Staked NFT'S"}
      onClose={() => setIsOpen(false)}
    />
  );
});
