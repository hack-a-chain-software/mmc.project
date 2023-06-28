import { Item } from "./item";
import { Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const roadmap = [
  {
    title: 'Q1 2023',
    items: [
      <>
        <span className="block pb-[24px]">
          Detective <br /> collection mint
        </span>
        <span className="block pb-[24px]">
          Undercover pup <br /> collection mint
        </span>
      </>,
    ],
  },
  {
    title: 'Q2 2023',
    items: [
      <>
        <span className="block pb-[24px]">
          Season one <br /> game launch
        </span>
        <span>
          Clue minting {'&'} <br /> revealing
        </span>
      </>,
    ],
  },
  {
    title: 'Q3 2023',
    items: [
      <>
        <span className="block pb-[24px]">Season one concludes</span>
        <span className="block pb-[24px]">Clue reveal {'&'} Solving XP rewards</span>
        <span>Season 2 announcements</span>
      </>,
    ],
  },
];

export function RoadmapCarousel() {
  const getNext = (index: number) => {
    const value = index + 1;

    return value >= roadmap.length ? 0 : value;
  };

  const getPrev = (index: number) => {
    const value = index - 1;

    return value < 0 ? roadmap.length - 1 : value;
  };

  return (
    <div className="carousel relative min-h-[490px] flex sm:hidden mt-[-70px]">
      <div className="absolute top-[80px] left-0 right-0 pointer-events-none z-[3]">
        <div className="w-full flex space-between mx-auto">
          <ChevronLeftIcon className="h-[80px] text-[#DF44A9]" />

          <ChevronRightIcon className="h-[80px] text-[#DF44A9] ml-auto" />
        </div>
      </div>

      <div className="carousel__viewport h-[520px]">
        <img
          src="./images/pins.png"
          className="absolute min-w-[calc(2*100vw)] h-[102px] z-[2] pointer-events-none top-[8px] left-[55%]"
        />

        {roadmap &&
          roadmap.map((item, index) => (
            <div
              id={"roadmap-carousel-item-" + index}
              key={"about-item" + index}
              className="basis-full min-w-full flex justify-center relative pt-[80px]"
            >
              <Fragment>
                <div className="carousel__snapper" />

                <div className="absolute top-[80px] left-0 right-0">
                  <div className="w-full px-[30px] flex space-between mx-auto">
                    <a
                      href={"#roadmap-carousel-item-" + getPrev(index)}
                      className="opacity-[0] h-[80px] w-[80px]"
                    />

                    <a
                      href={"#roadmap-carousel-item-" + getNext(index)}
                      className="opacity-[0]  h-[80px] w-[80px] ml-auto"
                    />
                  </div>
                </div>
              </Fragment>

              <Item {...item} />
            </div>
          ))}
      </div>
    </div>
  );
}
