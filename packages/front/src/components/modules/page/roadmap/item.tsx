import { ReactNode } from "react";

export function Item({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="text-white w-max space-y-[42px] min-w-[290px] max-w-[290px] w-screen">
      <div
        className="
          bg-pink-0
          flex items-center justify-center mx-auto
          border border-[2px] w-full
        "
      >
        <span
          children={title}
          className="uppercase text-[20px] leading-[40px] font-[300]"
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-[42px]">
        {items.map((value, index) => (
          <span
            children={value}
            key={title + "-roadmap-item-" + index}
            className="uppercase text-[15px] leading-[20px] font-[300]"
          />
        ))}
      </div>
    </div>
  );
}
