import { Item } from "./item";
import { Fragment } from "react";

const roadmap = [
  {
    title: "Q3 2022",
    items: [
      <span>
        Detective <br /> collection mint
      </span>,
      <span>
        Undercover pup <br /> collection mint
      </span>,
    ],
  },
  {
    title: "Q4 2022",
    items: [
      <span>
        $ Solve token <br /> presale {"&"} public sale
      </span>,
      <span>
        Season one <br /> game launch
      </span>,
      <span>
        Clue minting {"&"} <br /> staking
      </span>,
    ],
  },
  {
    title: "Q1 2023",
    items: [
      <span>Season one concludes</span>,
      <span>Staking {"&"} Solving rewards</span>,
      <span>Season 2 announcements</span>,
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
    <div className="carousel relative min-h-[900px] flex md:hidden mt-[-70px]">
      <div className="absolute top-[110px] left-0 right-0 pointer-events-none">
        <div className="max-w-[408px] flex space-between mx-auto">
          <img
            loading="lazy"
            src="./svgs/chevron.svg"
            className="h-[120px] rotate-[180deg]"
          />

          <img
            loading="lazy"
            src="./svgs/chevron.svg"
            className="h-[120px] ml-auto"
          />
        </div>
      </div>

      <div className="carousel__viewport">
        {roadmap &&
          roadmap.map((item, index) => (
            <div
              id={"roadmap-carousel-item-" + index}
              key={"about-item" + index}
              className="basis-full min-w-full flex items-center justify-center relative"
            >
              {index === 0 ? (
                <div className="carousel__snapper">
                  <div className="absolute top-[110px] left-0 right-0">
                    <div className="max-w-[408px] w-full flex space-between mx-auto">
                      <a
                        href={"#roadmap-carousel-item-" + getPrev(index)}
                        className="opacity-[0] h-[120px] w-[63px]"
                      />

                      <a
                        href={"#roadmap-carousel-item-" + getNext(index)}
                        className="opacity-[0] h-[120px] w-[63px] ml-auto"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <Fragment>
                  <div className="carousel__snapper" />

                  <div className="absolute top-[110px] left-0 right-0 ">
                    <div className="max-w-[408px] w-full flex space-between mx-auto">
                      <a
                        href={"#roadmap-carousel-item-" + getPrev(index)}
                        className="opacity-[0] h-[120px] w-[63px]"
                      />

                      <a
                        href={"#roadmap-carousel-item-" + getNext(index)}
                        className="opacity-[0] h-[120px] w-[63px] ml-auto"
                      />
                    </div>
                  </div>
                </Fragment>
              )}
              <Item {...item} />
            </div>
          ))}
      </div>
    </div>
  );
}
