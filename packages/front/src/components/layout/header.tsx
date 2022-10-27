import { isProd } from "@/utils/helpers";
import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    document.body.style.overflowY = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <div className="absolute w-full mx-auto pt-[50px] px-[30px]">
      <nav className="flex justify-between items-center max-w-[1290px] mx-auto">
        <ul className="hidden md:flex space-x-[40px]">
          {routes.map(({ label, path }) => (
            <li
              key={`mmc-navbar-route-${label}-to-${path}`}
              className="text-white uppercase text-[12px] leading-[15px] font-[300] cursor-pointer tracking-[0px] hover:opacity-[.8]"
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
          <button onClick={() => setIsOpen(true)}>
            <img src="./svgs/plus.svg" className="h-[32px]" />
          </button>
        </div>

        <div
          className={`md:hidden ${
            isOpen
              ? "motion-safe:animate-slider-right"
              : "motion-safe:animate-collapsed"
          } absolute bg-purple-0 inset-0 w-60 h-[100vh] z-[1]`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="block px-3 mt-4 mb-4 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 font-bold"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <nav>
            <ul className="flex flex-col ml-5 gap-4">
              {routes.map(({ label, path }) => (
                <li
                  key={`mmc-navbar-route-${label}-to-${path}`}
                  className="text-white uppercase text-[12px] leading-[15px] font-[400] cursor-pointer tracking-[0px] hover:opacity-[.8]"
                  onClick={() => setIsOpen(false)}
                >
                  <HashLink
                    to={"/" + path}
                    _hover={{
                      textDecoration: "unset",
                    }}
                    scroll={(el) =>
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    {label}
                  </HashLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-[32px]">
          {socials.map(({ icon, path }, i) => (
            <a
              href={path}
              key={`mmc-navbar-social-${i}`}
              className="cursor-pointer hover:opacity-[.8]"
            >
              <img loading="lazy" src={icon} className="h-[26px]" />
            </a>
          ))}

          <a
            // href={isProd ? "https://www.google.com" : "/play"}
            // className="w-[130px] h-[30px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[12px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] hover:bg-white hover:text-purple-0"
            className="w-[130px] h-[30px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[12px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] opacity-[0.6] cursor-not-allowed"
          >
            Play Now
          </a>
        </div>
      </nav>
    </div>
  );
}
