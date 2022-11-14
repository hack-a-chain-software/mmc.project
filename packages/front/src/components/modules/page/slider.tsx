export function Slider() {
  return (
    <div
      className="
        py-[25px] border-y-[2px]
        overflow-hidden
        z-[20]
        relative
      "
    >
      <div
        className="
          w-[calc(594*14)]
          animate-slider
          text-center
          flex
        "
      >
        {[...Array(14)].map((_, index) => (
          <span
            key={"slider-item-" + index}
            className="w-[594px] block text-white text-[14px] font-bold leading-[15px] whitespace-nowrap pr-[4px] tracking-[0px]"
          >
            ALERT • THERE’S BEEN A MURDER • CALLING ALL VOLUNTEERS •
          </span>
        ))}
      </div>
    </div>
  );
}
