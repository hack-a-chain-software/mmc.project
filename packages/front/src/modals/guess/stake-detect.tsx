import {
  detectivesContract,
	undercoverPupsContract,
} from '@/constants/env';
import { Selected } from '@/modals';
import { Token } from '@/interfaces';
import { useGame } from '@/stores/game';
import { StakeNftModal } from '@/modals';
// import { useWalletSelector } from '@/context/wallet';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useWallet } from '@/stores/wallet';

export const StakeDetect = forwardRef((_, ref) => {
	const { selector } = useWallet();

  const [isOpen, setIsOpen] = useState(false);

  const toggleStakeDetectModal = () => setIsOpen(true);

  useImperativeHandle(ref, () => ({
    toggleStakeDetectModal,
  }));

	const {
		stakeNft,
		accountId,
		getPupsById,
		getDetectivesById,
	} = useGame();

  const onStake = async (selected: Selected[]) =>
    void (await stakeNft(selected, accountId, selector!));

  const fetchTokens = async () => {
    if (!accountId) {
      return [];
    }

    const tokens: Selected[] = [];

    const detectives = await getDetectivesById(accountId, selector!);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    tokens.push(...detectives.map((detective: Token) =>
      ({ ...detective, contract: detectivesContract as string }),
    ));

    const undercoverPupsTokens = await getPupsById(accountId, selector!);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    tokens.push(...undercoverPupsTokens.map((pups: Token) =>
      ({ ...pups, contract: undercoverPupsContract as string }),
    ));

    return tokens;
  };

  return (
    <StakeNftModal
      isOpen={isOpen}
      onStake={onStake}
      fetchTokens={fetchTokens}
      onClose={() => setIsOpen(false)}
    />
  );
});
