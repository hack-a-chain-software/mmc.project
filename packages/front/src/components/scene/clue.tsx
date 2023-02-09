import { ClueInterface } from '@/interfaces';
import { useModal } from '@/stores/modal';

export const Clue = (props: ClueInterface & { sceneName: string }) => {
  const {
    onShowModal,
  } = useModal();

  const showModal = () => {
    onShowModal('sceneClue', props);
  };

	return (
    <div
      style={{
        top: `${props.position_top as string}%`,
        left: `${props.position_left as string}%`,
        width: props.width && `${props.width as string}px`,
      }}
      onClick={() => showModal()}
      className="xs:w-[8px] xs:h-[8px] sm:w-[16px] sm:min-h-[16px] md:min-w-[32px] md:min-h-[32px] lg:min-w-[42px] lg:min-h-[42px] xl:min-w-[48px] xl:min-h-[48px] rounded-full absolute"
    />
	);
};
