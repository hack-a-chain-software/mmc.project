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
    label: "Sneak Peaks",
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
    <div>
      <header className="absolute w-full mx-auto pt-[32px] z-[9]">
        <nav className="flex justify-between items-center w-[calc(100%-96px)] max-w-[1280px] h-[56px] mx-auto">
          <div>
            <ul className="hidden md:flex space-x-[38px]">
              {routes.map(({ label, path }) => (
                <li
                  key={`mmc-navbar-route-${label}-to-${path}`}
                  className="text-white uppercase text-sm font-[400] cursor-pointer tracking-[0px] hover:opacity-[.8]"
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
          </div>

          <div className="flex items-center pr-[54px] relative top-[-6px]">
            <div
              className="flex items-center"
            >
              {socials.map(({ icon, path }, i) => (
                <a
                  href={path}
                  key={`mmc-navbar-social-${i}`}
                  className="cursor-pointer hover:opacity-[.8] ml-[32px]"
                >
                  <img loading="lazy" src={icon} className="h-6" />
                </a>
              ))}
            </div>

            <div>
              <a
                // href={isProd ? "https://www.google.com" : "/play"}
                // className="w-[130px] h-[30px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[12px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] hover:bg-white hover:text-purple-0"
                className="w-[200px] h-6 hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-sm uppercase min-h-[40px] tracking-[0px] border border-white rounded-[50px] font-[300] opacity-[0.6] cursor-not-allowed uppercase ml-[32px]"
              >
                Connect Wallet
              </a>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
