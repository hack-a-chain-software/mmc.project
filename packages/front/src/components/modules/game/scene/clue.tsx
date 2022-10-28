import { ClueInterface } from "@/utils/interfaces";

export const Clue = ({ position }: ClueInterface) => {
  return (
    <div>
      <div
        style={position}
        className="w-[48px] h-[48px] rounded-full bg-white absolute"
      />
    </div>
  );
};
