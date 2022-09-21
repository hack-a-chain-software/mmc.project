import { Button } from "@/components";
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
    icon: "./svgs/discord.svg",
    path: "#",
  },
  {
    icon: "./svgs/twitter.svg",
    path: "#",
  },
];

export function PageHeader() {
  return (
    <div className="container mx-auto pt-[80px] pb-[59px]">
      <nav className="flex justify-between items-center max-w-[1620px] mx-auto">
        <ul className="flex space-x-[40px]">
          {routes.map(({ label, path }) => (
            <li
              key={`mmc-navbar-route-${label}-to-${path}`}
              className="text-white uppercase text-[15px] font-[300] cursor-pointer hover:opacity-[.8]"
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

        <div className="flex items-center space-x-[32px]">
          {socials.map(({ icon, path }, i) => (
            <a
              href={path}
              key={`mmc-navbar-social-${i}`}
              className="cursor-pointer hover:opacity-[.8]"
            >
              <img loading="lazy" src={icon} className="h-[32px]" />
            </a>
          ))}

          <Button onClick={() => {}}>Connect Wallet</Button>
        </div>
      </nav>
    </div>
  );
}
