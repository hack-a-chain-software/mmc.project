import { ReactNode } from "react";

export function Item({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="
          mb-[42px]
          bg-purple-0
          flex items-center justify-center
          border border-[2px] h-[60px] w-[415px]
        "
      >
        <span
          children={title}
          className="uppercase text-[28px] leading-[40px] font-[300]"
        />
      </div>

      <div className="flex items-center justify-center min-h-[120px]">
        <div
          children={text}
          className="uppercase text-[28px] leading-[40px] font-[300]"
        />
      </div>
    </div>
  );
}
