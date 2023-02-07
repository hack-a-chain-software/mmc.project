import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { BaseModalPropsInterface } from '@/interfaces';
import { twMerge } from 'tailwind-merge';
import { If, Spinner } from '@/components';

export const ModalTemplate = ({
  title,
  children,
  isOpen = false,
  className = '',
  isLoading = false,
  onClose = () => {},
}: Partial<BaseModalPropsInterface> & PropsWithChildren) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-[999999]"
      onClose={() => onClose()}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={
                twMerge(
                  'w-full max-w-4xl transform overflow-hidden bg-black shadow-xl transition-all px-9 py-6 text-white space-y-6 rounded-md',
                  className as string,
                )
              }
            >
              <div
                className="flex items-center justify-between"
              >
                <div
                  className="mr-[12px]"
                >
                  <span
                    children={title}
                    className="text-current text-xl"
                  />
                </div>

                <button
                  onClick={() => onClose()}
                  className={
                    twMerge(
                      'h-10 w-10 text-current outline-none hover:opacity-[0.6] flex items-center justify-center',
                      !!!title && 'absolute right-4 top-4',
                    )
                  }
                >
                  <XMarkIcon className="w-8 h-8 text-current" />
                </button>
              </div>

              <If
                condition={!isLoading}
                fallback={(
                  <Spinner/>
                ) as any}
              >
                {children}
              </If>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
