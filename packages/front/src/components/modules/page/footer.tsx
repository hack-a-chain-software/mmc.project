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
    icon: "./svgs/discord.svg",
    path: "#",
  },
  {
    icon: "./svgs/discord.svg",
    path: "#",
  },
];

export function PageFooter() {
  return (
    <div className="py-[60px] min-h-[300px] bg-purple-0">
      <div className="container mx-auto flex justify-between">
        <div>
          <img src="./images/hero.png" className="h-[175px]" />
        </div>

        <div className="flex flex-col items-end text-white space-y-[32px]">
          <div className="flex space-x-[32px]">
            {socials.map(({ icon, path }, i) => (
              <a href={path} key={`mmc-navbar-social-${i}`}>
                <img src={icon} className="h-[52px]" />
              </a>
            ))}
          </div>

          <div>
            <ul className="flex space-x-[32px]">
              {routes.map(({ label, path }) => (
                <li
                  children={label}
                  key={`mmc-navbar-route-${label}-to-${path}`}
                  className="text-white uppercase text-[14px] leading-[18px] font-[200]"
                />
              ))}
            </ul>
          </div>

          <div>
            <span className="text-white text-[14px] leading-[18px] font-[200]">
              ©Scribble Labs, The Murder Mystery Collective 2022
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
