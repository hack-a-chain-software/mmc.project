import clsx from "clsx";
import { PropsWithChildren } from "react";

export function Title({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className="text-center pb-[140px]">
      <span
        children={children}
        className={clsx(
          "uppercase text-white text-[50px] leading-[60px]",
          className
        )}
      />
    </div>
  );
}
