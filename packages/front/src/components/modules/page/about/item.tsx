import { ReactNode } from "react";

export function Item({ title, text }: { title: string; text: ReactNode }) {
  return (
    <div className="flex flex-col items-center mb-[120px] w-full flex">
      <div
        className="
          mb-[60px]
          bg-purple-0
          flex items-center justify-center
          border border-[2px] h-[75px] w-full max-w-[340px]
          rounded-[48px]
        "
      >
        <span
          children={title}
          className="uppercase text-xl font-[300]"
        />
      </div>

      <div className="flex items-center justify-center h-[68px]">
        <div
          children={text}
          className="uppercase text-lg font-[300]"
        />
      </div>
    </div>
  );
}
