interface Position {
	top?: string;
	left?: string;
	rigth?: string;
	bottom?: string;
}

interface PortalInterface {
	onClick: () => void;
	position: Position;
}

export const Portal = ({
    position,
    onClick = () => {}
  }: PortalInterface) => {
	return (
		<div
			style={position}
			onClick={() => onClick()}
			className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] xl:w-[96px] xl:h-[96px] rounded-full absolute z-[99999]"
		/>
	);
};

export default Portal;
