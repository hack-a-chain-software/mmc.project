import { useMemo, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import NavbarModal from './navbar-modal';
import routes from '@/json/routes.json';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useWalletSelector } from '@/context/wallet';
import {
  If,
	Button,
	Socials,
	WalletMenu,
} from '@/components';
import { useGame } from '@/stores/game';
import { GuessModal } from '@/modals';

export function Header() {
	const navigate = useNavigate();

	const [showGuessModal, setShowGuessModal] = useState(false);

	const { pathname } = useLocation();

  const { guessingIsOpen, autenticated } = useGame();

	const inGame = useMemo(() => {
		return pathname === '/987654321';
	}, [pathname]);

	return (
		<>
      <If
        condition={showGuessModal}
      >
        <GuessModal
          isOpen={showGuessModal}
          onClose={() => setShowGuessModal(false)}
        />
      </If>

			<header className="absolute w-full mx-auto pt-[32px] z-[9]">
				<nav className="flex justify-between items-center w-[calc(100%-96px)] max-w-[1280px] h-[56px] mx-auto">
					{!inGame && (
						<div>
							<ul className="hidden lg:flex space-x-[38px]">
								{routes &&
									routes.map(({ label, path }) => (
										<li
											key={`mmc-navbar-route-${label as string}-to-${
												path as string
											}`}
											className="text-white uppercase text-sm font-[400] cursor-pointer tracking-[0px] hover:opacity-[.8]"
										>
											<HashLink
												to={`${path as string}`}
												_hover={{
													textDecoration: 'unset',
												}}
												scroll={(el) =>
													el.scrollIntoView({
														behavior: 'smooth',
														block: 'start',
													})
												}
											>
												{label}
											</HashLink>
										</li>
									))}
							</ul>
						</div>
					)}

					{!inGame && <NavbarModal />}

					{!inGame && (
						<div className="flex items-center md:pr-[54px] space-x-[32px] relative">
							<Socials />

							<div>
								<button
									onClick={() => {
										navigate('/play');
									}}
									disabled
									className="w-[180px] h-[30px] hidden lg:flex flex items-center justify-center bg-purple-0 text-white text-[12px] uppercase min-h-[40px] px-[13px] tracking-[0px] border border-white rounded-[50px] font-[400] hover:bg-white hover:text-purple-0 cursor-not-allowed opacity-[0.5]"
								>
									Coming soon
								</button>
							</div>
						</div>
					)}

					{inGame && (
						<>
							<button
								onClick={() => navigate('/')}
								className="mr-auto flex space-x-[8px] items-center"
							>
								<ArrowLeftIcon className="text-white w-[18px]" />

								<span className="text-white">Back</span>
							</button>

              {
                guessingIsOpen() && autenticated && (
                  <Button
                    onClick={() => setShowGuessModal(true)}
                    disabled={!autenticated}
                    className="mr-8"
                  >
                    <span>Guessing now open</span>
                  </Button>
                )
              }

							<Socials />

							<WalletMenu />
						</>
					)}
				</nav>
			</header>
		</>
	);
}
