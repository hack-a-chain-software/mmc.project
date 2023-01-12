export interface SceneInterface {
	name: AssetInterface[];
	clues: ClueInterface[];
	warps: WarpsInterface[];
	images: string | string[];
}

export interface ClueInterface {
	name?: string;
	about?: string;
	owner?: string | null;
	position: Position;
	image: string;
}

export interface WarpsInterface {
	position: Position;
	sendTo: string | number;
}

interface Position {
	top?: string;
	left?: string;
	rigth?: string;
	bottom?: string;
}

interface AssetInterface {
	order: string | number;
	image: string;
}
