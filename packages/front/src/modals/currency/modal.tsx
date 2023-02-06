import { useGame } from '@/stores/game';
import { ModalTemplate } from '../modal-template';
import { GameCurrencyInterface } from '@/interfaces';
import { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { CurrencyItem } from './currency-item';

type CurrencyCallback = (currency: GameCurrencyInterface) => void;

let callback;

export const CurrencyModal = forwardRef((_, ref) => {
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

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Select the currency"
      className="max-w-md pb-[38px]"
    >
      {currencies.map((currency) => (
        <CurrencyItem
          {...currency}
          callbackCurrency={(args) => callback(args)}
          key={`select-currency-modal-item: ${currency.contract as string}`}
        />
      ))}
    </ModalTemplate>
  );
});
