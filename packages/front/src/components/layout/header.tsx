import { isProd } from "@/utils/helpers";
import { HashLink } from "react-router-hash-link";

const routes = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "The Case",
    path: "#the-case",
  },
  {
    label: "Play",
    path: "#how-to-play",
  },
  {
    label: "Roadmap",
    path: "#roadmap",
  },
  {
    label: "Sneak Peeks",
    path: "#sneak-peeks",
  },
];

const socials = [
  {
    icon: "/svgs/discord.svg",
    path: "#",
  },
  {
    icon: "/svgs/twitter.svg",
    path: "#",
  },
];

export function Header() {
  return (
    <div className="absolute w-full mx-auto pt-[48px] px-[30px]">
      <nav className="flex justify-between items-center max-w-[1280px] mx-auto">
        <ul className="hidden md:flex space-x-[40px]">
          {routes.map(({ label, path }) => (
            <li
              key={`mmc-navbar-route-${label}-to-${path}`}
              className="text-white uppercase text-[16px] leading-[15px] font-[400] cursor-pointer tracking-[0px] hover:opacity-[.8]"
            >
              <HashLink
                to={"/" + path}
                _hover={{
                  textDecoration: "unset",
                }}
                scroll={(el) =>
                  el.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {label}
              </HashLink>
            </li>
          ))}
        </ul>

        <div className="block md:hidden">
          <button onClick={() => {}}>
            <img src="./svgs/plus.svg" className="h-[32px]" />
          </button>
        </div>

        <div className="flex items-center space-x-[32px]">
          {socials.map(({ icon, path }, i) => (
            <a
              href={path}
              key={`mmc-navbar-social-${i}`}
              className="cursor-pointer hover:opacity-[.8]"
            >
              <img loading="lazy" src={icon} className="h-[24px]" />
            </a>
          ))}

          <a
            // href={isProd ? "https://www.google.com" : "/play"}
            // className="w-[130px] h-[30px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[12px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] hover:bg-white hover:text-purple-0"
            className="w-[200px] h-[40px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[13px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] opacity-[0.6] cursor-not-allowed uppercase"
          >
            Connect Wallet
          </a>
        </div>
      </nav>
    </div>
  );
}
