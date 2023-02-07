import {
  detectivesContract,
	undercoverPupsContract,
} from '@/constants/env';
import { Selected } from '@/modals';
import { Token } from '@/interfaces';
import { useGame } from '@/stores/game';
import { StakeNftModal } from '@/modals';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useWallet } from '@/stores/wallet';
import { useUser } from '@/stores/user';

export const StakeDetect = forwardRef((_, ref) => {
	const { selector } = useWallet();

  const [isOpen, setIsOpen] = useState(false);

  const toggleStakeDetectModal = () => setIsOpen(true);

  useImperativeHandle(ref, () => ({
    toggleStakeDetectModal,
  }));

	const {
		stakeNft,
		getPupsById,
		getDetectivesById,
	} = useGame();

  const {
    accountId,
  } = useUser();

  const onStake = async (selected: Selected[]) =>
    void (await stakeNft(selected, accountId, selector as any));

  const fetchTokens = async () => {
    if (!accountId) {
      return [];
    }

    const tokens: Selected[] = [];

    const detectives = await getDetectivesById(accountId, selector as any);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    tokens.push(...detectives.map((detective: Token) =>
      ({ ...detective, contract: detectivesContract as string }),
    ));

    const undercoverPupsTokens = await getPupsById(accountId, selector as any);

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
