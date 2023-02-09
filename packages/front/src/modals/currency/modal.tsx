import { CurrencyItem } from './item';
import { useGame } from '@/stores/game';
import { ModalTemplate } from '../modal-template';
import { BaseModalPropsInterface, GameCurrencyInterface } from '@/interfaces';
import { useMemo } from 'react';
import { useModal } from '@/stores/modal';

type CurrencyCallback = (currency: GameCurrencyInterface) => void;

export interface CurrencyModalInterface extends Partial<
  BaseModalPropsInterface
> {
  buttonText: string,
  callback: CurrencyCallback,
}

export const CurrencyModal = () => {
  const {
    props,
    currency,
    onCloseModal,
  } = useModal();

  const {
    callback,
    title = '',
  } = useMemo(() => props.currency as CurrencyModalInterface || {}, [props]);

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
      isOpen={currency}
      onClose={() => onCloseModal('currency')}
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

        {currencies.map((currencyItem) => (
          <CurrencyItem
            {...currencyItem}
            callbackCurrency={(args) => onClaim(args)}
            key={`select-currency-modal-item: ${currencyItem.contract as string}`}
          />
        ))}
      </div>
    </ModalTemplate>
  );
};
