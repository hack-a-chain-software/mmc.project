import routes from '@/utils/json/routes.json';
import socials from '@/utils/json/socials.json';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useMemo } from 'react';
import { Socials } from '@/components';

export function Footer() {
  const {
    pathname,
  } = useLocation();

  const isVisible = useMemo(() => {
    return pathname !== '/play';
  }, [pathname]);

  return (
    <div
      className={
        twMerge('py-[60px] min-h-[300px] bg-purple-0', !isVisible && 'hidden')
      }
    >
      <div className="container mx-auto flex flex-col space-y-[30px] md:space-y-[120px] lg:space-y-0 lg:justify-between lg:flex-row max-w-[1280px] px-[30px]">
        <div>
          <img
            loading="lazy"
            src="./svgs/mmc-tt_white.svg"
            className="h-[10rem]"
          />
        </div>

        <div className="flex flex-col lg:items-end text-white">
          <Socials/>

          <div className="mb-[25px] mt-[58px]">
            <ul className="flex flex-col md:flex-row space-y-[12px] md:space-y-0 md:space-x-[32px]">
              {routes.map(({ label, path }) => (
                <li
                  children={label}
                  key={`mmc-navbar-route-${label}-to-${path}`}
                  className="text-white uppercase text-sm font-[200] cursor-pointer hover:opacity-[.8]"
                />
              ))}
            </ul>
          </div>

          <div className="text-center">
            <span className="text-white text-sm font-[200]">
              © Scribble Labs, The Murder Mystery Collective 2022
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
