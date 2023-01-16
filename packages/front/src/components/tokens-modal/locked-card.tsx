// import { useState, useMemo } from 'react';
// import { differenceInMilliseconds, addMilliseconds } from 'date-fns';
// import { getUTCDate, formatBigNumberWithDecimals } from '@/utils/helpers';
// import { useWalletSelector } from '@/utils/context/wallet';
import { Button } from '../button';
import { twMerge } from 'tailwind-merge';
import { ProgressBar } from '../progress-bar';

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

export const LockedCard = () => {
  // const { accountId } = useWalletSelector();

  // const [showFastPass, setShowFastPass] = useState(false);

  // const createdAt = useMemo((): Date => {
  //   return getUTCDate(Number(props.start_timestamp) / 1000000);
  // }, [props.start_timestamp]);

  // const endAt = useMemo((): Date => {
  //   return addMilliseconds(createdAt, Number(props.vesting_duration) / 1000000);
  // }, [props.start_timestamp, props.vesting_duration]);

  // const progress = useMemo(() => {
  //   const today = new Date();
  //   const base = differenceInMilliseconds(endAt, createdAt);
  //   const current = differenceInMilliseconds(today, createdAt) * 100;

  //   return Math.round(current / base);
  // }, [props.start_timestamp, props.vesting_duration]);

  // const decimals = useMemo(() => {
  //   return new Big(10).pow(props?.token?.decimals || 1);
  // }, [props]);

  // const totalAmount = useMemo(() => {
  //   return formatBigNumberWithDecimals(props.locked_value, decimals);
  // }, [props, decimals]);

  // const avaialbleToClaim = useMemo(() => {
  //   return formatBigNumberWithDecimals(props.available_to_withdraw, decimals);
  // }, [props, decimals]);

  // const withdrawnAmount = useMemo(() => {
  //   return formatBigNumberWithDecimals(props.withdrawn_tokens, decimals);
  // }, [props, decimals]);

  const isEnded = true;

  return (
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
            className="text-sm text-white font-medium"
          >
            Vesting period
          </span>
        </div>

        <div
          className=""
        >
          <ProgressBar
            done={20}
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
            className="text-sm"
          >
            Starts
          </span>

          <span
            className="text-sm font-semibold"
            children={'16/11/2022'}
          />
        </div>

        <div
          className="flex justify-between items-center space-x-1"
        >
          <span
            className="text-sm"
          >
            Ends
          </span>

          <span
            className="text-sm font-semibold"
            children={'16/12/2022'}
          />
        </div>

        <div
          className="flex justify-between items-center space-x-1"
        >
          <span
            className="text-sm"
          >
            Locked Amount
          </span>

          <span
            className="text-sm font-semibold"
            children={'85 JUMP'}
          />
        </div>

        <div
          className="flex justify-between items-center space-x-1"
        >
          <span
            className="text-sm"
          >
            Earn p/ day
          </span>

          <span
            className="text-sm font-semibold"
            children={'3.33 JUMP'}
          />
        </div>

        <div
          className="flex justify-between items-center space-x-1"
        >
          <span
            className="text-sm"
          >
            Total unlocked
          </span>

          <span
            className="text-sm font-semibold"
            children={'30 JUMP'}
          />
        </div>
      </div>

      <div
        className="pt-2 space-y-2"
      >
        <Button
          disabled={true}
          className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto bg-transparent"
        >
          Withdraw unlocked
        </Button>


        <Button
          disabled={true}
          className="w-full text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
        >
          Fast Pass
        </Button>
      </div>
    </div>
  );
};

export default LockedCard;
