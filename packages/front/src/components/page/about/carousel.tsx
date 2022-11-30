import { Item } from "./item";
import { Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const items = [
  {
    icon: "mint",
    title: "Mint your characters",
    items: [
      {
        title: "Detectives",
        text: (
          <div className="flex flex-col">
            <div className="whitespace-nowrap">
              <span className="font-[500]">SUPPLY:</span> TBD
            </div>
            <div className="whitespace-nowrap">
              <span className="font-[500]">CLUE STAKING:</span> YES
            </div>
            <div className="whitespace-nowrap">
              <span className="font-[500]">REWARD ELIGABLE:</span> YES
            </div>
          </div>
        ),
      },
      {
        title: "UNDERCOVER PUPS",
        text: (
          <span>
            <span className="font-[500]">SUPPLY:</span> TBD <br />{" "}
            <span className="font-[500]">CLUE STAKING:</span> YES <br />{" "}
            <span className="font-[500]">REWARD ELIGABLE:</span> YES
          </span>
        ),
      },
    ],
  },
  {
    icon: "investigate",
    title: "Investigate Clues",
    items: [
      {
        title: "Staking",
        text: (
          <span>MINT {"&"} STAKE CLUES TO REVEAL PUBLICLY ON THE GAME MAP</span>
        ),
      },
      {
        title: "Discord",
        text: (
          <span>
            DISCUSS YOUR <br /> THEORIES ON THE CASE <br /> WITH THE COMMUNITY
          </span>
        ),
      },
    ],
  },
  {
    icon: "solve",
    title: "Solve & \n Earn",
    items: [
      {
        title: "Solve",
        text: (
          <span>
            GUESS THE <br /> MURDERER, METHOD, <br /> {"&"} MOTIVE
          </span>
        ),
      },
      {
        title: "Earn",
        text: "SOLVE THE CASE SUCCESSFULLY AND EARN REWARDS",
      },
    ],
  },
];

export function AboutCarousel() {
  const getNext = (index: number) => {
    const value = index + 1;

    return value >= items.length ? 0 : value;
  };

  const getPrev = (index: number) => {
    const value = index - 1;

    return value < 0 ? items.length - 1 : value;
  };

  return (
    <div className="carousel relative min-h-[640px] flex sm:hidden">
      <div className="absolute top-[30px] left-0 right-0 pointer-events-none z-[4]">
        <div className="w-full flex space-between mx-auto">
          <ChevronLeftIcon className="h-[80px] text-[#972DF2]" />

          <ChevronRightIcon className="h-[80px] text-[#972DF2] ml-auto" />
        </div>
      </div>

      <div className="carousel__viewport">
        {items.map(({ icon, title, items }, index) => (
          <div
            id={"about-carousel-item-" + index}
            key={"about-item" + index}
            className="basis-full min-w-full flex items-center justify-center relative"
          >
            <Fragment>
              <div className="carousel__snapper" />

              <div className="absolute top-[30px] left-0 right-0 flex space-between">
                <div className="max-w-[408px] w-full flex space-between mx-auto">
                  <a
                    href={"#about-carousel-item-" + getPrev(index)}
                    className="opacity-[0] h-[80px] w-[80px]"
                  />

                  <a
                    href={"#about-carousel-item-" + getNext(index)}
                    className="opacity-[0] h-[80px] w-[80px] ml-auto"
                  />
                </div>
              </div>
            </Fragment>

            <div
              className="
                text-white
                text-center
                max-w-full
                md:space-y-[48px]
                space-y-[14px]
                px-[30px]
                flex flex-col items-center justify-center overflow-hidden
              "
            >
              <div className="mb-[54px]">
                <img
                  loading="lazy"
                  src={`./images/${icon}.png`}
                  className="h-[130px]"
                />
              </div>

              <div className="md:max-w-[360px] text-center">
                <span
                  children={title}
                  className="uppercase text-[16px] sm:text-[22px] leading-[50px] font-[300]"
                />
              </div>

              {items &&
                items.map((item, i) => (
                  <Item {...item} key={"about-card-item-" + i} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
