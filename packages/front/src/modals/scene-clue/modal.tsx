import { useState } from 'react';
import { ClueInterface } from '@/interfaces';
import { Button, Socials } from '@/components';
import { ModalTemplate } from '../modal-template';
import { BaseModalPropsInterface } from '@/interfaces/modal';
import { ConfirmClaimClueModal, ConfirmStakeClueModal } from '@/modals';

export const SceneClueModal = ({
  name,
  media,
  nft_id,
	isOpen,
  isOwner,
	onClose,
  isMinted,
  isStaked,
	sceneName,
  description,
}: BaseModalPropsInterface & ClueInterface & { sceneName: string }) => {
	const [showConfirmPickModal, setShowConfirmPickModal] = useState(false);
  const [showConfirmStakeModal, setShowConfirmStakeModal] = useState(false);

  return (
    <>
      <ConfirmClaimClueModal
        nft_id={nft_id}
        isOpen={showConfirmPickModal}
        onClose={() => setShowConfirmPickModal(false)}
      />

      <ConfirmStakeClueModal
        nft_id={nft_id}
        isOpen={showConfirmStakeModal}
        onClose={() => setShowConfirmStakeModal(false)}
      />

      <ModalTemplate
        isOpen={isOpen}
        onClose={onClose}
        className="
          w-max
          relative
          transform
          transition-all
          flex
          items-center
          justify-center
          space-x-[32px]
        "
      >
        <div className="w-[250px] h-[250px] border-white mt-1">
          <img src={media} className="h-full w-full" />
        </div>

        <div className="flex flex-col justify-between h-[250px]">
          <div className="">
            <span
              className="
                uppercase
                text-white
                text-lg
              "
            >
              {isOwner ? 'Founded' : 'Available'}
            </span>
          </div>

          <div>
            <div>
              <span
                className="
                  uppercase
                  text-white
                  text-sm
                  font-[300]
                "
              >
                Clue: {name}
              </span>
            </div>

            <div className="">
              <span
                className="
                  uppercase
                  text-white
                  text-sm
                  font-[300]
                "
              >
                Location: {sceneName}
              </span>
            </div>
          </div>

          <div className="max-w-[720px] w-screen">
            <span
              className="
                uppercase
                text-white
                text-sm
                font-[400]
              "
            >
              {description}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="mr-[32px] flex space-x-[20px]">
              <Button
                disabled={!isMinted}
                onClick={() => setShowConfirmPickModal(true)}
                className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:text-white"
              >
                Mint
              </Button>

              <Button
                disabled={isOwner && !isStaked}
                onClick={() => setShowConfirmStakeModal(true)}
                className="w-[125px] min-h-[30px] h-[30px] text-sm flex justify-center disabled:bg-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:text-white"
              >
                Stake
              </Button>
            </div>

            <div className="flex space-x-[19px]">
              <div>
                <span className="text-white text-sm uppercase">
                  Share the news
                </span>
              </div>

              <Socials />
            </div>
          </div>
        </div>
      </ModalTemplate>
    </>
  );
};
