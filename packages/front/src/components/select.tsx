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
                  className="absolute z-10 mt-1 w-full max-h-60 focus:outline-none cursor-pointer shadow-lg p-[2px] overflow-hidden bg-white"
                >
                  <div
                    className="flex-col w-full overflow-hidden"
                  >
                    {items.map(({ label, value: itemValue }) => (
                      <Listbox.Option
                        key={`select-option-${itemValue as string}`}
                        value={itemValue}
                        className="cursor-pointer overflow-hidden"
                      >
                        {({ selected: selectedValue }) => (
                          <div
                            className="select-none relative py-2 pl-3 pr-9 cursor-pointer text-[#A500FB] hover:opacity-[0.7]"
                          >
                            <div className="block truncate first-letter:uppercase cursor-pointer">
                              {label}
                            </div>

                            {selectedValue ? (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
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
