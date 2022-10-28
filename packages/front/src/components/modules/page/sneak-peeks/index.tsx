import { Item } from "./item";
import { useState } from "react";

export function SneakPeeks() {
  const [selected, setSelected] = useState<any>([]);

  const updateSelected = (value: number, index: number) => {
    const newSelected = [...selected];

    newSelected[index] = value;

    setSelected(newSelected);
  };

  return (
    <div
      className="
      flex flex-col xl:flex-row
      xl:space-x-[50px] xl:space-y-0
      space-y-[50px]
      z-[10]
      relative
      pt-[30px]
    "
    >
      <Item
        selected={selected}
        key="sneak-peek-item-0"
        updateSelected={(value: number) => updateSelected(value, 0)}
      />

      <Item
        selected={selected}
        key="sneak-peek-item-1"
        className="hidden xl:flex"
        updateSelected={(value: number) => updateSelected(value, 1)}
      />
    </div>
  );
}
