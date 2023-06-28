import { Item } from "./item";
import { AboutCarousel } from "./carousel";

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
            <span className="font-[500]">CLUE REVEALING:</span> YES <br />{" "}
            <span className="font-[500]">REWARD ELIGIBLE:</span> YES
          </span>
        ),
      },
      {
        title: "UNDERCOVER PUPS",
        text: (
          <span>
            <span className="font-[500]">SUPPLY:</span> TBD <br />{" "}
            <span className="font-[500]">CLUE REVEALING:</span> YES <br />{" "}
            <span className="font-[500]">REWARD ELIGIBLE:</span> YES
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
        title: "CLUE REVEALING",
        text: (
          <span>MINT {"&"} REVEAL PUBLICLY ON THE GAME MAP</span>
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
    title: "Solve & \n Earn XP",
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
        text: "SOLVE THE CASE SUCCESSFULLY AND EARN XP REWARDS",
      },
    ],
  },
];

export function About() {
  return (
    <div>
      <div
        className="
          mx-auto
          hidden sm:flex flex-col justify-between items-center space-y-[120px] lg:flex-row lg:items-start lg:space-y-0 pt-[105px]
          max-w-[1024px]
        "
      >
        {items.map(({ icon, title, items }, index) => (
          <div
            className="
              w-[100%]
              text-white
              text-center
              max-w-[280px]
              flex flex-col items-center justify-center
            "
            key={"about-item" + index}
          >
            <div className="mb-[32px]">
              <img
                loading="lazy"
                src={`./images/${icon}.png`}
                className="h-[115px]"
              />
            </div>

            <div className="max-w-[200px] text-center mb-[120px] h-[54px]">
              <span
                children={title}
                className="uppercase text-2xl font-[400]"
              />
            </div>

            {items &&
              items.map((item, i) => (
                <Item {...item} key={"about-card-item-" + i} />
              ))}
          </div>
        ))}
      </div>

      <AboutCarousel />
    </div>
  );
}
