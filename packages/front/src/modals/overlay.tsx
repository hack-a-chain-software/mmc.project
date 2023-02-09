import { Spinner } from '@/components';
import { useModal } from '@/stores/modal';
import { useEffect } from 'react';

export const Overlay = () => {
  const {
    overlay,
  } = useModal();

  useEffect(() => {
    if (!overlay) {
      return;
    }

    document.body.classList.toggle('modal-open');

    return () => {
      document.body.classList.toggle('modal-open');
    };
  }, [overlay]);

  if (!overlay) {
    return;
  }

  return (
    <div
      className="fixed inset-0 bg-white/50 z-[999999999999999] flex items-center justify-center flex-col"
    >
      <Spinner
        className="h-auto my-4 text-pink-0"
      />
    </div>
  );
};
