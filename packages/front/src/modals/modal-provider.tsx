import { Fragment, useMemo } from 'react';
import * as moduleModals from '.';

const modalKeys = [
  'ConfirmStakeClueModal',
  'CurrencyModal',
  'FastPassModal',
  'GameCluesModal',
  'GuessModal',
  'GuessesModal',
  'LockedTokensModal',
  'SceneClueModal',
  'WalletModal',
  'Overlay',
];

export const ModalProvider = () => {
  const modals = useMemo(() => {
    return modalKeys.map((key) => moduleModals[key]);
  }, []);

  return (
    <Fragment>
      {
        modals.map((Modal, index) => (
          <Modal
            key={`modals-providers-modal-${index}`}
          />
        ))
      }
    </Fragment>
  );
};
