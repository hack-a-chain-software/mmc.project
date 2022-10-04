import { ReactNode } from "react";

export function Item({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="text-white w-max space-y-[42px] max-w-[415px] w-full">
      <div
        className="
          bg-pink-0
          flex items-center justify-center mx-auto
          border border-[2px] h-[42px] sm:h-[60px] w-[415px]
          max-w-[230px] ms:max-w-[330px] md:max-w-none
        "
      >
        <span
          children={title}
          className="uppercase text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px]"
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-[42px]">
        {items.map((value, index) => (
          <span
            children={value}
            key={title + "-roadmap-item-" + index}
            className="uppercase text-[16px] sm:text-[22px] md:text-[28px] md:leading-[40px] font-[300]"
          />
        ))}
      </div>
    </div>
  );
}