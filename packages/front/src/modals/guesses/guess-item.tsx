import { GuessInterface } from '@/interfaces';
// import { shortenAddress } from '@/helpers';
import { format } from 'date-fns';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

export const GuessItem = ({
  order,
  burned,
  motive,
  weapon,
  murdered,
  created_at,
}: GuessInterface & { order: number }) => (
 <div
  className={
    twMerge(
      'grid grid-cols-12 max-w-full',
      order % 2 === 1 && 'bg-white/10',
    )
  }
 >
  <div
    className="col-span-2 overflow-hidden"
  >
    <span
      title={murdered}
      children={murdered}
      className="text-xs"
    />
  </div>

  <div
    className="col-span-3 overflow-hidden max-w-full truncate"
  >
    <span
      title={weapon}
      children={weapon}
      className="text-xs"
    />
  </div>

  <div
    className="col-span-4 overflow-hidden max-w-full truncate"
  >
    <span
      title={motive}
      children={motive}
      className="text-xs"
    />
  </div>

  <div
    className="col-span-2 overflow-hidden"
  >
    <span
      className="text-xs"
      title={format(new Date(created_at as string), 'y MM dd')}
      children={format(new Date(created_at as string), 'y MM dd')}
    />
  </div>

  <div
    className="col-span-1 flex justify-center"
  >
    {burned && (
      <CheckIcon
        className="text-white w-6 h-6"
      />
    )}

    {!burned && (
      <XMarkIcon
        className="text-white w-6 h-6"
      />
      )}
  </div>
 </div>
);
