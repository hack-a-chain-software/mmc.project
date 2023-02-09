import Big from 'big.js';
import { useState, useMemo } from 'react';
import { format, differenceInMilliseconds, addMilliseconds, isBefore } from 'date-fns';
import { getUTCDate, formatBigNumberWithDecimals } from '@/helpers';
// import { useWalletSelector } from '@/context/wallet';
import { Button, ProgressBar } from '@/components';
import { twMerge } from 'tailwind-merge';
import { useGame } from '@/stores/game';
import { FastPassModal } from '@/modals';
import { useWallet } from '@/stores/wallet';

export interface Vesting {
  id?: string;
  beneficiary: string;
  locked_value: string;
  start_timestamp: string;
  vesting_duration: string;
  fast_pass: boolean;
  withdrawn_tokens: string;
  available_to_withdraw: string;
}


export interface Token {
  spec: string;
  name: string;
  symbol: string;
  icon: any;
  reference: any;
  reference_hash: any;
  decimals: number;
}


export interface ContractData {
  owner_id: string;
  base_token: string;
  vesting_duration: string;
  fast_pass_cost: string;
  fast_pass_acceleration: string;
  fast_pass_beneficiary: string;
}

export const LockedTokensCard = (
  props: Vesting & {
    token: Token; contractData: ContractData, baseTokenBalance: string,
  },
) => {
  const { accountId, selector } = useWallet();
  const [showFastPass, setShowFastPass] = useState(false);

  const { withdrawLockedTokens } = useGame();

  const createdAt = useMemo((): Date => {
    return getUTCDate(Number(props.start_timestamp) / 1000000);
  }, [props.start_timestamp]);

  const endAt = useMemo((): Date => {
    return addMilliseconds(createdAt, Number(props.vesting_duration) / 1000000);
  }, [props.start_timestamp, props.vesting_duration]);

  const progress = useMemo(() => {
    const today = new Date();
    const base = differenceInMilliseconds(endAt, createdAt);
    const current = differenceInMilliseconds(today, createdAt) * 100;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _progress = Math.round(current / base);

    if (_progress > 100) {
      return 100;
    }

    return _progress;
  }, [props.start_timestamp, props.vesting_duration]);

  const decimals = useMemo(() => {
    return new Big(10).pow(props?.token?.decimals || 1);
  }, [props]);

  const totalAmount = useMemo((): string => {
    return formatBigNumberWithDecimals(props.locked_value, decimals);
  }, [props, decimals]);

  const avaialbleToClaim = useMemo((): string => {
    return formatBigNumberWithDecimals(props.available_to_withdraw, decimals);
  }, [props, decimals]);

  const withdrawnAmount = useMemo(() => {
    return formatBigNumberWithDecimals(props.withdrawn_tokens, decimals);
  }, [props, decimals]);

  const isEnded = useMemo(() => {
    const today = getUTCDate();

    return isBefore(endAt, today as Date);
  }, [endAt]);

  const getAvailableTokens = async () => {
    if (!accountId) {
      return;
    }

    await withdrawLockedTokens([props], accountId, selector as any);
  };

  return (
    <>
      <div
        className="
          px-6
          py-4
          space-y-4
          bg-white
          max-w-[315px]
          rounded-md
          bg-[rgba(255,255,255,0.1);]
          flex flex-col items-stretch justify-center
        "
      >
        <div
          className={
            twMerge(
              'text-black bg-white px-2.5 py-1 rounded-full text-sm max-w-max',
              isEnded && 'text-white bg-[#3FB460]',
            )
          }
        >
          <span
            children={isEnded ? 'Finished' : 'Vesting period'}
          />
        </div>

        <div
          className=""
        >
          <div
            className=""
          >
            <span
              className="text-xs text-white font-medium"
            >
              Vesting period
            </span>
          </div>

          <div
            className=""
          >
            <ProgressBar
              done={progress}
            />
          </div>
        </div>

        <div
          className="space-y-4"
        >
          <div
            className="flex justify-between items-center space-x-1"
          >
            <span
              className="text-xs"
            >
              Starts
            </span>

            <span
              className="text-xs font-semibold"
              children={format(createdAt, 'dd MMMM y')}
            />
          </div>

          <div
            className="flex justify-between items-center space-x-1"
          >
            <span
              className="text-xs"
            >
              Ends
            </span>

            <span
              className="text-xs font-semibold"
              children={format(endAt, 'dd MMMM y')}
            />
          </div>

          <div
            className="flex justify-between items-center space-x-1"
          >
            <span
              className="text-xs"
            >
              Locked Amount
            </span>

            <span
              className="text-xs font-semibold break-words"
              children={`${totalAmount} ${props.token?.symbol}`}
            />
          </div>

          <div
            className="flex justify-between items-center space-x-1"
          >
            <span
              className="text-xs"
            >
              Total unlocked
            </span>

            <span
              className="text-xs font-semibold"
              children={`${avaialbleToClaim} ${props.token?.symbol}`}
            />
          </div>
        </div>

        <div
          className="pt-6 space-y-4"
        >
          <Button
            onClick={() => void getAvailableTokens()}
            disabled={props.available_to_withdraw === '0' || !accountId}
            className="w-full text-xs flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
          >
            Withdraw unlocked
          </Button>


          <Button
            disabled={
              props.fast_pass || props.baseTokenBalance === '0' || !accountId
            }
            onClick={() => setShowFastPass(true)}
            className="w-full text-xs flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
          >
            {props.fast_pass ? 'Bought Fast Pass' : 'Buy Fast Pass'}
          </Button>
        </div>
      </div>

      <FastPassModal
        onClose={() => setShowFastPass(false)}
        isOpen={showFastPass}
        token={props.token}
        vestingId={props.id || ''}
        passCost={props.contractData.fast_pass_cost}
        totalAmount={props.locked_value}
        acceleration={Number(props.contractData?.fast_pass_acceleration)}
      />
    </>
  );
};

export default LockedTokensCard;
