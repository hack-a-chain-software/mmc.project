import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { HashLink } from 'react-router-hash-link';
import routes from '@/json/routes.json';

export const NavbarModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="block lg:hidden mr-auto">
        <button onClick={() => setIsOpen(true)}>
          <img src="./svgs/plus.svg" className="h-[32px]" />
        </button>
      </div>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[9999]" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex pl-10 ">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className="
                      pointer-events-auto
                      relative  w-60 h-[100vh] bg-purple-0"
                  >
                    <div className="block px-3 mt-4 mb-4 text-white">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
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
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default NavbarModal;
