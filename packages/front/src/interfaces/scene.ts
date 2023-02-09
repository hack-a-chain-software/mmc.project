export interface SceneInterface {
  id: string;
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
  width: string;
  height: string;
  position_top: string;
  position_left: string;
  media_small: string;
  placeholder_small: string;
  nft_id: string;
}

export interface WarpsInterface {
	warps_to: string | number;
  position_top: string;
  position_left: string;
}

interface AssetInterface {
	z_index: string | number;
	media: string;
}
