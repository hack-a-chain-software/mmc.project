export interface SceneInterface {
	name: string;
	clues: ClueInterface[];
	warps: WarpsInterface[];
	images: AssetInterface[];
}

export interface ClueInterface {
	media: string;
  name: string;
  isOwner: boolean;
  isStaked: boolean;
  isMinted: boolean;
  description?: string;
  placeholder: string;
  position_top: string;
  position_left: string;
  nft_id: string;
}

export interface WarpsInterface {
	warps_to: string | number;
  position_top: string;
  position_left: string;
}

interface AssetInterface {
	order: string | number;
	image: string;
}
