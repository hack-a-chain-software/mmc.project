import { ReactNode } from "react";

export function Item({ title, items }: { title: string; items: ReactNode[] }) {
  return (
    <div className="text-white w-max space-y-[56px] max-w-[270px] w-screen flex-1">
      <div
        className="
          bg-pink-0
          flex items-center justify-center mx-auto
          border border-[2px] w-full h-[76px] rounded-[48px]
        "
      >
        <span
          children={title}
          className="uppercase text-xl font-[300]"
        />
      </div>

      <div className="flex flex-col items-center text-center space-y-[42px]">
        {items.map((value, index) => (
          <span
            children={value}
            key={title + "-roadmap-item-" + index}
            className="uppercase text-lg font-[300]"
          />
        ))}
      </div>
    </div>
  );
}
