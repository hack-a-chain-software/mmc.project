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
				className="xs:w-[8px] xs:h-[8px] sm:w-[16px] sm:h-[16px] md:w-[32px] md:h-[32px] lg:w-[42px] lg:h-[42px] xl:w-[48px] xl:h-[48px] rounded-full bg-white/[0.75] absolute z-[12]"
			/>

			<ClueModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				{...props}
			/>
		</>
	);
};
