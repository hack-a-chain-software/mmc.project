import { twMerge } from "tailwind-merge";
import { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="text-center pb-[50px]">
      <span
        children={children}
        className={twMerge(
          "uppercase text-white text-[20px] md:text-[20px] md:leading-[24px]",
          className
        )}
      />
    </div>
  );
}
