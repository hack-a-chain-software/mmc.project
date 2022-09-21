import { twMerge } from "tailwind-merge";

export function Button({
  children,
  onClick,
  className = "",
}: {
  children: any;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      children={children}
      onClick={() => onClick()}
      className={twMerge(
        "bg-purple-0 text-white text-[14px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] hover:bg-white hover:text-purple-0",
        className
      )}
    />
  );
}
