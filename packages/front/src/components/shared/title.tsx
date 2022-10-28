import { twMerge } from "tailwind-merge";
import { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="text-center pb-[56px]">
      <span
        children={children}
        className={twMerge(
          "uppercase text-white text-[20px] md:text-[34px] md:leading-[42px] font-heavy",
          className
        )}
      />
    </div>
  );
}
