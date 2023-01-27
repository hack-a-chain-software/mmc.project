import Big from 'big.js';
import { useMemo, Fragment } from 'react';
import { buyFastPass } from '@/helpers/near';
import { useWalletSelector } from '@/context/wallet';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../button';

export function BuyFastPassModal({
  token,
  passCost,
  vestingId,
  totalAmount,
  acceleration,
  isOpen = false,
  onClose = () => {},
}: {
  token: any;
  isOpen: boolean;
  acceleration: number;
  vestingId: string;
  totalAmount: string;
  passCost: string;
  onClose: () => void;
}) {
  const { accountId, selector } = useWalletSelector();

  const decimals = useMemo(() => {
    return new Big(10).pow(token?.decimals ?? 0);
  }, [token]);

  const formattedTotal = useMemo(() => {
    return new Big(totalAmount ?? 0).mul(0.05).div(decimals).toFixed(2);
  }, [totalAmount, token]);

  const buy = async () => {
    if (!accountId) {
      return;
    }

    void await buyFastPass(
      vestingId,
      totalAmount?.toString() || '',
      passCost?.toString() || '',
      accountId,
      selector,
    );
  };

  return (
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
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-xl transform overflow-hidden bg-black shadow-xl transition-all pt-[50px] p-[25px] text-white">
								<button
									onClick={() => onClose()}
									className="
                    h-10 w-10
                    text-white
                    border border-white
                    absolute right-[10px] top-[10px]
                    flex items-center justify-center
                    outline-none
                    hover:bg-white hover:text-black
                  "
								>
									<XMarkIcon className="w-12 h-12 text-current" />
								</button>

								<div className="pb-[24px]">
									<span className="uppercase text-sm">
                    Buy Fast Pass!
									</span>
								</div>

								<div className="pb-[24px] text-sm">
									<span>
                    With the fast pass, your vesting period is reduced and you
                    get your locked tokens faster
									</span>
								</div>

								<div className="pb-[27px] text-sm">
									<span>Time decrease:{
                    (-100 / acceleration+100).toFixed(0)
                  }%</span>
								</div>

                <div className="pb-[27px] text-sm">
                  Price: {formattedTotal} {token?.symbol}
                </div>

								<Button
                  onClick={() => void buy()}
									className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:opacity-75 disabled:cursor-not-allowed uppercase mx-auto"
								>
									Buy Now!
								</Button>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
  );
}
