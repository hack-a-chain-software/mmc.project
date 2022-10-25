import { ReactNode } from "react";

export function Item({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div className="flex flex-col items-center max-w-[290px] mb-[25px]">
      <div
        className="
          mb-[25px]
          bg-purple-0
          max-w-[290px]
          flex items-center justify-center
          border border-[1px] h-[40px] w-[415px]
        "
      >
        <span
          children={title}
          className="uppercase text-[20px] leading-[40px] font-[300]"
        />
      </div>

      <div className="flex items-center justify-center h-[68px]">
        <div
          children={text}
          className="uppercase text-[16px] leading-[25px] font-[300]"
        />
      </div>
    </div>
  );
}
