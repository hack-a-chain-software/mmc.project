import { useState } from 'react';
import ClueModal from './clue-modal';
import { ClueInterface } from '@/utils/interfaces';

export const Clue = (props: ClueInterface & { sceneName: string }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        style={props.position}
        onClick={() => setShowModal(true)}
        className="w-[48px] h-[48px] rounded-full bg-white/[0.75] absolute"
      />

      <ClueModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        {...props}
      />
    </>
  );
};
