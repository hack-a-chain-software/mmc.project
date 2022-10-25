const routes = [
  {
    label: "About",
    path: "#",
  },
  {
    label: "Contact",
    path: "#",
  },
  {
    label: "Term & Conditions",
    path: "#",
  },
  {
    label: "Privacy Policy",
    path: "#",
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

export function Footer() {
  return (
    <div className="py-[60px] min-h-[300px] bg-purple-0 px-[30px] sm:px-0">
      <div className="container mx-auto flex flex-col space-y-[30px] md:space-y-[120px] lg:space-y-0 lg:justify-between lg:flex-row max-w-[1290px]">
        <div>
          <img
            loading="lazy"
            src="./svgs/mmc-tt_white.svg"
            className="h-[132px]"
          />
        </div>

        <div className="flex flex-col lg:items-end text-white">
          <div className="flex space-x-[32px] mb-[58px]">
            {socials.map(({ icon, path }, i) => (
              <a
                href={path}
                key={`mmc-navbar-social-${i}`}
                className="cursor-pointer hover:opacity-[.8]"
              >
                <img loading="lazy" src={icon} className="h-[20px]" />
              </a>
            ))}
          </div>

          <div className="mb-[25px]">
            <ul className="flex flex-col md:flex-row space-y-[12px] md:space-y-0 md:space-x-[32px]">
              {routes.map(({ label, path }) => (
                <li
                  children={label}
                  key={`mmc-navbar-route-${label}-to-${path}`}
                  className="text-white uppercase text-[12px] leading-[15px] font-[200] cursor-pointer hover:opacity-[.8]"
                />
              ))}
            </ul>
          </div>

          <div className="text-center">
            <span className="text-white text-[14px] leading-[18px] font-[200]">
              © Scribble Labs, The Murder Mystery Collective 2022
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
