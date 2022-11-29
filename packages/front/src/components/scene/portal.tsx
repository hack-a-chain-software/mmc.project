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
			className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] xl:w-[96px] xl:h-[96px] rounded-full bg-blue-100/[0.75] absolute"
		/>
	);
};

export default Portal;