import { ReactNode } from "react";

export function Item({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div className="flex flex-col items-center mb-[120px]">
      <div
        className="
          mb-[82px]
          bg-purple-0
          flex items-center justify-center
          border border-[2px] h-[75px] w-[340px]
          rounded-[48px]
        "
      >
        <span
          children={title}
          className="uppercase text-[22px] leading-[40px] font-[300]"
        />
      </div>

      <div className="flex items-center justify-center h-[68px]">
        <div
          children={text}
          className="uppercase text-[18px] leading-[40px] font-[300]"
        />
      </div>
    </div>
  );
}
