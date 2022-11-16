import { Item } from "./item";
import { RoadmapCarousel } from "./carousel";

const roadmap = [
  {
    title: "Q3 2022",
    items: [
      <>
        <span>
          Detective <br /> collection mint
        </span>
        ,
        <span>
          Undercover pup <br /> collection mint
        </span>
        ,
      </>,
    ],
  },
  {
    title: "Q4 2022",
    items: [
      <>
        <span>
          $ Solve token <br /> presale {"&"} public sale
        </span>
        ,
        <span>
          Season one <br /> game launch
        </span>
        ,
        <span>
          Clue minting {"&"} <br /> staking
        </span>
        ,
      </>,
    ],
  },
  {
    title: "Q1 2023",
    items: [
      <>
        <span>Season one concludes</span>,
        <span>Staking {"&"} Solving rewards</span>,
        <span>Season 2 announcements</span>,
      </>,
    ],
  },
];

export function Roadmap() {
  return (
    <div>
      <div
        className="
          hidden
          sm:flex
          flex-col
          items-center
          space-y-[120px]
          justify-between
          md:flex-row md:items-start md:space-y-0 pt-[98px]
          max-w-[1024px] mx-auto
        "
      >
        {roadmap.map((item) => (
          <Item {...item} key={"roadmap-" + item.title} />
        ))}
      </div>

      <RoadmapCarousel />
    </div>
  );
}
