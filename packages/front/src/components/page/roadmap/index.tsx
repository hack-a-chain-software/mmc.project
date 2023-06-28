import { Item } from './item';
import { RoadmapCarousel } from './carousel';

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
        <span className="block pb-[24px]">Clue revealing and solving XP rewards</span>
        <span>Season 2 announcements</span>
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
          lg:flex-row lg:items-start lg:space-y-0 pt-[98px]
          max-w-[1024px] mx-auto
        "
      >
        {roadmap.map((item) => (
          <Item {...item} key={`roadmap-${item.title}`} />
        ))}
      </div>

      <RoadmapCarousel />
    </div>
  );
}
