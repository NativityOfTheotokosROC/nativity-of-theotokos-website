import NativityIcon from "@/public/assets/nativity-icon.webp";
import { HeroSectionModel } from "@/src/lib/models/hero-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const HeroSection = function ({ model }) {
	const { introduce, title, subtitle } = model.modelView;
	const tCaptions = useTranslations("imageCaptions");

	return (
		<section
			className="hero bg-gray-950 bg-cover bg-center bg-no-repeat text-black md:bg-position-[60%_85%]"
			style={{ backgroundImage: `url(${NativityIcon.src})` }}
		>
			<motion.div
				animate={
					introduce && {
						backgroundColor: ["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"],
					}
				}
				viewport={{ once: true }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="hero-content flex h-fit min-h-[76lvh] flex-col items-center justify-center p-8 md:flex-row md:items-center lg:p-20"
			>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={
						introduce && {
							opacity: 1,
							y: 0,
						}
					}
					viewport={{ once: true }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className={`hero-message flex w-full flex-col justify-center gap-5 md:w-[35em] md:max-w-1/2 md:p-8 lg:w-full`}
				>
					<span
						className={`heading ${title.length < 20 ? "text-7xl" : "text-6xl"} lg:text-7xl ${georgia.className} wrap-break-word hyphens-auto text-white`}
					>
						{title}
					</span>
					<hr className="my-4 text-gray-300" />
					<span className={`text-lg text-gray-300`}>{subtitle}</span>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={
						introduce && {
							opacity: 1,
							y: 0,
						}
					}
					viewport={{ once: true }}
					transition={{ ease: "easeOut" }}
					className={`hero-icon hidden items-center justify-center md:flex md:w-1/2`}
				>
					<Link
						className="contents"
						href={"/assets/nativity-icon.jpg"}
						target="_blank"
					>
						<Image
							className="h-[21.333em] w-[16em] transition duration-200 ease-out hover:scale-[1.03] hover:cursor-pointer active:scale-[1.03]"
							src={NativityIcon}
							alt={tCaptions("iconOfTheNativity")}
							title={tCaptions("iconOfTheNativity")}
							loading="eager"
						/>
					</Link>
				</motion.div>
			</motion.div>
		</section>
	);
} satisfies ModeledVoidComponent<HeroSectionModel>;

export default HeroSection;
