import { ReactNode } from "react";

export function Item({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="
          md:mb-[42px]
          mb-[14px]
          bg-purple-0
          flex items-center justify-center
          border border-[2px] h-[42px] sm:h-[60px] w-[415px]
          max-w-[280px] ms:max-w-[330px] md:max-w-none
        "
      >
        <span
          children={title}
          className="uppercase text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px] font-[300]"
        />
      </div>

      <div className="flex items-center justify-center min-h-[120px]">
        <div
          children={text}
          className="uppercase text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px] font-[300]"
        />
      </div>
    </div>
  );
}
