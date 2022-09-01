import { Item } from "./item";

export function SneakPeeks() {
  return (
    <div
      className="
      flex flex-col xl:flex-row
      xl:space-x-[50px] xl:space-y-0
      space-y-[50px]
    "
    >
      <Item />
      <Item />
      <Item />
    </div>
  );
}
