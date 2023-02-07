import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ModalTemplate } from '../modal-template';
import GuessFormModal from './form';
import { Button } from '@/components';
import { useState, useMemo, useEffect, useRef } from 'react';
// import { useWalletSelector } from '@/context/wallet';
import { twMerge } from 'tailwind-merge';
import isEmpty from 'lodash/isEmpty';
import { useGame } from '@/stores/game';
import { GameConfigInterface } from '@/interfaces';
import { StakeDetect } from './stake-detect';
import { BuyTickets } from './buy-tickets';
import { useWallet } from '@/stores/wallet';

export const GuessModal = ({
  isOpen,
  onClose,
}: Partial<BaseModalPropsInterface>) => {
	const { selector } = useWallet();

	const {
		config,
		accountId,
		getTicketsById,
		getStakedNftsById,
	} = useGame();

  const stakeDetect = useRef<{
    toggleStakeDetectModal: () => void,
  }>();

  const buyTickets = useRef<{
    toggleBuyTicketsModal: () => void,
  }>();

	const [ticketsAmount, setTicketsAmount] = useState(0);

	const [showGuessingForm, setShowGuessingForm] = useState(false);
	const [hasStakedGuessingNfts, sethasStakedGuessingNfts] = useState(false);

	useEffect(() => {
		if (!accountId || !isOpen) {
			return;
		}

		void (async () => {
			const tickets = await getTicketsById(accountId, selector!) || 0;

			setTicketsAmount(tickets as number);

			const totalGuess = await getStakedNftsById(accountId, selector!);

			sethasStakedGuessingNfts(!isEmpty(totalGuess));
		})();

    return;
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
        }}
      />

      <StakeDetect
        ref={stakeDetect}
      />

      <BuyTickets
        ref={buyTickets}
      />

      <ModalTemplate
        isOpen={isOpen}
        onClose={onClose}
        title="Ready to guess?"
        className="w-full max-w-3xl transform overflow-hidden bg-black shadow-xl transition-all py-[44px] px-[50px] text-white"
      >
        <div
          className="w-full space-y-4"
        >
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
              onClick={() => stakeDetect.current?.toggleStakeDetectModal()}
              className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
            >
              With Stake
            </Button>

            <Button
              disabled={!hasStakedGuessingNfts}
              onClick={() => buyTickets.current?.toggleBuyTicketsModal()}
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
