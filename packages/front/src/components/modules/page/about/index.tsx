import { Item } from "./item";

const items = [
  {
    icon: "mint",
    title: "Mint your characters",
    items: [
      {
        title: "Detectives",
        text: (
          <span>
            <span className="font-[500]">SUPPLY:</span> TBD <br />{" "}
            <span className="font-[500]">CLUE STAKING:</span> YES <br />{" "}
            <span className="font-[500]">REWARD ELIGABLE:</span> YES
          </span>
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

export function About() {
  return (
    <div className="flex justify-between items-start">
      {items.map(({ icon, title, items }, index) => (
        <div
          className="
            text-white
            text-center
            max-w-[485px]
            space-y-[48px]
            flex flex-col items-center justify-center
          "
          key={"about-item" + index}
        >
          <div className="mb-[52px]">
            <img src={`./images/${icon}.png`} />
          </div>

          <div className="pb-[32px] max-w-[360px] text-center">
            <span
              children={title}
              className="uppercase text-[38px] leading-[50px] font-[300]"
            />
          </div>

          {items &&
            items.map((item, i) => (
              <Item {...item} key={"about-card-item-" + i} />
            ))}
        </div>
      ))}
    </div>
  );
}
