import { Button } from '@/components';
import { GuessInterface } from '@/interfaces';

export const GuessItem = ({
  order,
  burned,
  motive,
  weapon,
  murdered,
  created_at,
  claimRewards,
}: GuessInterface & { order: number, claimRewards: () => Promise<void> }) => (
  <div
    className="
      px-6
      py-6
      space-y-4
      bg-white
      rounded-md
      bg-[rgba(255,255,255,0.1);]
      flex flex-col items-stretch justify-center
    "
  >
    <div
      className="flex flex-col overflow-hidden"
    >
      <span
        className="text-xs font-bold"
      >
        Murdered
      </span>

      <span
        title={murdered}
        children={murdered}
        className="text-xs"
      />
    </div>

    <div
      className="flex flex-col overflow-hidden"
    >
      <span
        className="text-xs font-bold"
      >
        Weapon
      </span>

      <span
        title={weapon}
        children={weapon}
        className="text-xs"
      />
    </div>

    <div
      className="flex flex-col overflow-hidden"
    >
      <span
        className="text-xs font-bold"
      >
        Motive
      </span>

      <span
        title={motive}
        children={motive}
        className="text-xs"
      />
    </div>

    <div
      className="flex flex-col overflow-hidden"
    >
      <Button
        onClick={() => void claimRewards()}
        disabled={burned}
        className="w-full text-xs flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto disabled:hover:bg-purple-0 disabled:hover:text-white"
      >
        Claim Rewards
      </Button>
    </div>
 </div>
);
