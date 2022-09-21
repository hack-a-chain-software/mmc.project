import { twMerge } from "tailwind-merge";
import { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="text-center pb-[70px] md:pb-[140px]">
      <span
        children={children}
        className={twMerge(
          "uppercase text-white text-[28px] md:text-[50px] md:leading-[60px]",
          className
        )}
      />
    </div>
  );
}
