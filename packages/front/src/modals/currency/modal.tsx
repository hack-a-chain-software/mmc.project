import { CurrencyItem } from './item';
import { useGame } from '@/stores/game';
import { ModalTemplate } from '../modal-template';
import { GameCurrencyInterface } from '@/interfaces';
import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';

type CurrencyCallback = (currency: GameCurrencyInterface) => void;

let callback;

export const CurrencyModal = forwardRef(({
  title = 'Select the currency',
}: { title?: string, buttonText: string }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const ToggleCurrencyModalWithCallback = (value: CurrencyCallback) => {
    setIsOpen(true);

    callback = value;
  };

  useImperativeHandle(ref, () => ({
    ToggleCurrencyModalWithCallback,
  }));

  const {
    config,
  } = useGame();

  const currencies = useMemo(() => {
    if (!config ) {
      return [];
    }

    return config.currencies;
  }, [config]);

  const onClaim = async (payload: GameCurrencyInterface) => {
    if (!callback) {
      return;
    }

    callback(payload);
  };

  return (
    <ModalTemplate
      title={title}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="max-w-md text-black bg-white rounded-md"
    >
      <div>
        <div>
          <span
            className=""
          >
            Select payment currency:
          </span>
        </div>

        {currencies.map((currency) => (
          <CurrencyItem
            {...currency}
            callbackCurrency={(args) => onClaim(args)}
            key={`select-currency-modal-item: ${currency.contract as string}`}
          />
        ))}
      </div>
    </ModalTemplate>
  );
});
