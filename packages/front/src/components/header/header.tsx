import { useMemo } from 'react';
import { HashLink } from 'react-router-hash-link';
import NavbarModal from './navbar-modal';
import routes from '@/utils/json/routes.json';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import { Socials } from '@/components';

export function Header() {
	const navigate = useNavigate();

	const { pathname } = useLocation();

	const isVisible = useMemo(() => {
		return pathname !== '/987654321';
	}, [pathname]);

	return (
		<div className={twMerge(!isVisible && 'hidden')}>
			<header className="absolute w-full mx-auto pt-[32px] z-[9]">
				<nav className="flex justify-between items-center w-[calc(100%-96px)] max-w-[1280px] h-[56px] mx-auto">
					<div>
						<ul className="hidden lg:flex space-x-[38px]">
							{routes.map(({ label, path }) => (
								<li
									key={`mmc-navbar-route-${label as string}-to-${
										path as string
									}`}
									className="text-white uppercase text-sm font-[400] cursor-pointer tracking-[0px] hover:opacity-[.8]"
								>
									<HashLink
										to={`/${path as string}`}
										_hover={{
											textDecoration: 'unset',
										}}
										scroll={(el) =>
											el.scrollIntoView({ behavior: 'smooth', block: 'start' })
										}
									>
										{label}
									</HashLink>
								</li>
							))}
						</ul>
					</div>

					<NavbarModal />

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
				</nav>
			</header>
		</div>
	);
}
