import { twMerge } from 'tailwind-merge';
import { CheckIcon } from '@heroicons/react/24/solid';

export const StakeCard = ({
  image,
  title,
  onSelect,
  isSelected,
}: {
  id: string,
  title: string,
  image: string,
  isSelected: boolean,
  onSelect: () => void,
}) => {
  return (
    <div
      onClick={() => onSelect()}
      className="w-[173px] h-[173px] rounded-md relative cursor-pointer hover:opacity-80"
    >
      <img
        src={`https://images.weserv.nl/?url=${image}&dpr=4`}
        className="rounded-md"
      />

      <div
        className={
          twMerge(
            'border border-[#F124AD] w-5 h-5 rounded-md absolute top-2 right-2 bg-[rgba(255,255,255,0.6)]',
            isSelected && 'bg-[#F124AD]',
          )
        }
      >
        {isSelected && (
          <CheckIcon
            className="w-full h-full text-white"
          />
        )}

      </div>

      <div
        className="p-2.5 absolute left-2 right-2 bottom-2 rounded-md bg-[rgba(255,255,255,0.85)]"
      >
        <span
          children={title}
          className="text-black text-xs"
        />
      </div>
    </div>
  );
};

export default StakeCard;
