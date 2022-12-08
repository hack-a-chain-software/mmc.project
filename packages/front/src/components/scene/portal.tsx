interface Position {
	top?: string;
	left?: string;
	rigth?: string;
	bottom?: string;
}

interface PortalInterface {
	onClick: () => any;
	position: Position;
}

export const Portal = ({ position, onClick = () => {} }: PortalInterface) => {
	return (
		<div
			style={position}
			onClick={() => onClick()}
			className="w-[24px] h-[24px] lg:w-[48px] lg:h-[48px] xl:w-[48px] xl:h-[48px] rounded-full bg-blue-100/[0.75] absolute z-[9]"
		/>
	);
};

export default Portal;
