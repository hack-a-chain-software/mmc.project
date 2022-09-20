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
    "
    >
      {[...Array(3)].map((_, index) => (
        <Item
          selected={selected}
          key={"sneak-peek-item" + index}
          updateSelected={(value: number) => updateSelected(value, index)}
        />
      ))}
    </div>
  );
}
