import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ModalTemplate } from '../modal-template';
import GuessFormModal from './form';
import { Button } from '@/components';
import { useState, useMemo, useEffect } from 'react';
import { useWalletSelector } from '@/context/wallet';
import { twMerge } from 'tailwind-merge';
import isEmpty from 'lodash/isEmpty';
import { useGame } from '@/stores/game';
import { StakeNftModal } from '@/modals';
import {
	detectivesContract,
	tokenContract,
	undercoverPupsContract,
} from '@/constants/env';
import { GameConfigInterface, Token } from '@/interfaces';
import { Selected } from '@/modals';
import { viewFunction } from '@/helpers/near';

export const GuessModal = ({
  isOpen,
  onClose,
}: BaseModalPropsInterface) => {
	const { selector } = useWalletSelector();

	const {
		config,
		stakeNft,
		accountId,
		getPupsById,
		getTicketsById,
		getStakedNftsById,
		getDetectivesById,
		buyTicketsWithTokens,
	} = useGame();

	const [ticketsAmount, setTicketsAmount] = useState(0);

	const [showStakeModal, setShowStakeModal] = useState(false);
	const [showStakedModal, setShowStakedModal] = useState(false);

	const [showGuessingForm, setShowGuessingForm] = useState(false);
	const [hasStakedGuessingNfts, sethasStakedGuessingNfts] = useState(false);

	useEffect(() => {
		if (!accountId || !isOpen) {
			return;
		}

		void (async () => {
			const tickets = await getTicketsById(accountId, selector) || 0;

			setTicketsAmount(tickets as number);

			const totalGuess = await getStakedNftsById(accountId, selector);

			sethasStakedGuessingNfts(!isEmpty(totalGuess));
		})();

    return () => {
      setTicketsAmount(0);
      sethasStakedGuessingNfts(false);
    };
	}, [accountId, isOpen]);

	const hasTickets = useMemo(() => {
		return ticketsAmount > 0;
	}, [ticketsAmount]);

  return (
    <>
    <GuessFormModal
      config={config as GameConfigInterface}
      isOpen={showGuessingForm}
      onClose={() => {
        setShowGuessingForm(false);
        onClose();
      }}
    />

    <StakeNftModal
      isOpen={showStakeModal}
      onClose={() => setShowStakeModal(false)}
      onStake={async (selected) =>
        void (await stakeNft(selected, accountId, selector))
      }
      fetchTokens={async () => {
        if (!accountId) {
          return [];
        }

        const tokens: Selected[] = [];

        const detectives = await getDetectivesById(accountId, selector);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        tokens.push(...detectives.map((detective: Token) =>
          ({ ...detective, contract: detectivesContract as string }),
        ));

        const undercoverPupsTokens = await getPupsById(accountId, selector);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        tokens.push(...undercoverPupsTokens.map((pups: Token) =>
          ({ ...pups, contract: undercoverPupsContract as string }),
        ));

        return tokens;
      }}
    />

    <StakeNftModal
      isMulti={false}
      isOpen={showStakedModal}
      buttonText={'Buy Ticket'}
      onClose={() => setShowStakedModal(false)}
      onStake={async (selected) => {
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          token_id,
          contract,
        } = selected[0];

        void (await buyTicketsWithTokens(
          token_id,
          contract,
          tokenContract,
          accountId,
          selector,
        ));
      }}
      fetchTokens={async () => {
        if (!accountId) {
          return [];
        }

        const stakedNfts = await getStakedNftsById(accountId, selector);

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
      }}
    />

      <ModalTemplate
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white"
      >
        <div
          className="w-full space-y-4"
        >
          <div className="mr-[12px] pb-4">
            <span className="uppercase text-xl">Ready to guess?</span>
          </div>

          <div>
            <span>
              You need to burn tickets for every guess you want to risk
            </span>
          </div>

          <div>
            <span>
              Stake your NFT's and receive tickets to be able to guess
              before the season ends.
            </span>
          </div>

          <div>
            <span className="text-sm text-[#F124AD]">
              After the first skate of your NFT, you can use MMC Tokens
              to buy more tickets and guess more often!
            </span>
          </div>

          <div className="pb-2.5">
            <span>Redeem tickets:</span>
          </div>

          <div className="flex items-center space-x-[10px]">
            <Button
              onClick={() => setShowStakeModal(true)}
              className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
            >
              With Stake
            </Button>

            <Button
              disabled={!hasStakedGuessingNfts}
              onClick={() => setShowStakedModal(true)}
              className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
            >
              With MMC Tokens
            </Button>
          </div>

          <div>
            <span>
              With your tickets in hand, just guess and hope for the
              rewards
            </span>
          </div>

          <div>
            <Button
              disabled={!hasTickets}
              onClick={() => setShowGuessingForm(true)}
              className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto disabled:bg-transparent"
            >
              Guess Now!
            </Button>
          </div>

          <div
            className={twMerge(
              '',
              hasTickets ? 'text-white' : 'text-[#DB2B1F]',
            )}
          >
            <span children={`Tickets Available: ${ticketsAmount}`} />
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};
