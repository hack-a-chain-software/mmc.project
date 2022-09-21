export function Slider() {
  return (
    <div
      className="
        py-[22px] border-y-[2px]
        overflow-hidden
      "
    >
      <div className="w-[calc(594*14)] animate-slider text-center flex">
        {[...Array(14)].map((_, index) => (
          <span
            key={"slider-item-" + index}
            className="w-[594px] block text-white text-[14px] leading-[18px] whitespace-nowrap pr-[4px]"
          >
            ALERT • THERE’S BEEN A MURDER • CALLING ALL VOLUNTEERS •
          </span>
        ))}
      </div>
    </div>
  );
}
