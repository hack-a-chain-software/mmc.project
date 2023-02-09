import { twMerge } from 'tailwind-merge';

export const Spinner = ({
  className = '',
}: { className?: string }) => {
  return (
    <div
      className={
        twMerge(
          'flex items-center justify-center h-[300px] w-full my-auto text-black',
          className,
        )
      }
    >
      <svg
        className="animate-spin h-8 w-8 border border-l-current rounded-full"
        viewBox="0 0 24 24"
      />
    </div>
  );
};
