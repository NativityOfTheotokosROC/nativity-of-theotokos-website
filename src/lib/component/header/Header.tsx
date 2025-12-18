import { ModeledVoidComponent } from "@mvc-react/components";
import { HeaderModel } from "../../model/header";
import Image from "next/image";
import Link from "next/link";

const Header = function ({ model }) {
	const { title, navlinks } = model.modelView;
	return (
		<header className="w-full max-w-full">
			<div className="header-content flex flex-wrap gap-8 justify-between p-6 px-9 items-center bg-gray-900 text-white">
				<div className="logo flex gap-4 items-center justify-center md:max-w-[20em]">
					<Image src="/logo.svg" alt="logo" height={60} width={60} />
					<span className="text-base font-serif">{title}</span>
				</div>
				<nav className="nav-bar flex gap-4 items-center justify-center">
					{[
						...navlinks.map((navlink, index) => (
							<Link
								key={index}
								href={navlink.link}
								className="navlink text-sm uppercase no-underline hover:text-amber-400"
							>
								{navlink.text}
							</Link>
						)),
					]}
				</nav>
			</div>
		</header>
	);
} as ModeledVoidComponent<HeaderModel>;

export default Header;
