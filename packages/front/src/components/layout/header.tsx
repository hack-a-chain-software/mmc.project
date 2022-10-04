import { Button } from "@/components";
import { HashLink } from "react-router-hash-link";
import { useNearWalletSelector } from "@/utils/context/wallet";

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

export function Header() {
  const { accountId, signOut, toggleModal } = useNearWalletSelector();

  return (
    <div className="absolute w-full mx-auto pt-[50px] pb-[25px] md:pt-[80px] md:pb-[59px] px-[30px] sm:px-0">
      <nav className="flex justify-between items-center max-w-[1620px] mx-auto">
        <ul className="hidden md:flex space-x-[40px]">
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
              <img loading="lazy" src={icon} className="h-[32px]" />
            </a>
          ))}

          {!!!accountId ? (
            <Button className="hidden lg:block" onClick={() => toggleModal()}>
              Connect Wallet
            </Button>
          ) : (
            <Button onClick={() => signOut()}>
              <span children={accountId?.split(".").at(0)} />
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
