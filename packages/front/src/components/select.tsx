import { Fragment, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface Item<V> {
  label: string;
  value: V | null;
}

export function Select<V>({
  value,
  onChange,
  items,
  placeholder,
}: {
  items: readonly Item<V>[];
  placeholder: string;
  value: V | null;
  onChange: (value: V | null) => void;
}) {
  const selected = useMemo(() => {
    return items.find((item) => item.value === value);
  }, [value]);

  return (
    <Listbox
      value={value}
      onChange={(newValue) => onChange(newValue === value ? null : newValue)}
    >
      {({ open }) => (
        <>
          <div className="mt-1 relative w-full">
            <Listbox.Button
              className="w-full"
            >
              <div
                className="flex justify-between py-[11px] px-[25px] bg-[#A500FB] border border-white hover:opacity-[0.8]"
              >
                <span className="first-letter:uppercase truncate pl-[15px] pr-[30px] text-[16px]">
                  {selected?.label ?? placeholder}
                </span>

                <ChevronDownIcon className="w-[24px]" />
              </div>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="cursor-pointer shadow-lg">
                <div
                  className="absolute z-10 mt-1 w-full focus:outline-none cursor-pointer shadow-lg p-[2px] overflow-auto bg-white"
                >
                  <div
                    className="flex-col w-full overflow-auto max-h-[250px]"
                  >
                    {items.map(({ label, value: itemValue }) => (
                      <Listbox.Option
                        key={`select-option-${itemValue as string}`}
                        value={itemValue}
                        className="cursor-pointer"
                      >
                        {() => (
                          <div
                            className="select-none relative py-2 pl-3 pr-9 cursor-pointer text-[#A500FB] hover:opacity-[0.7]"
                          >
                            <div className="block first-letter:uppercase cursor-pointer break-words">
                              {label}
                            </div>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
