import { Item } from "./item";

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

export function Roadmap() {
  return (
    <div className="flex items-start justify-between">
      {roadmap.map((item) => (
        <Item {...item} key={"roadmap-" + item.title} />
      ))}
    </div>
  );
}
