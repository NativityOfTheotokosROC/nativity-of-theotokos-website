import { HeroSectionModel } from "@/src/lib/model/hero-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const HeroSection = function ({ model }) {
	const { introduce, title, subtitle } = model.modelView;
	const tCaptions = useTranslations("imageCaptions");

	return (
		<section className="hero bg-gray-950 text-black bg-[url(/ui/nativity-icon.jpg)] bg-cover bg-center bg-no-repeat md:bg-size-[100%] md:bg-position-[60%_85%]">
			<motion.div
				animate={
					introduce && {
						backgroundColor: ["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"],
					}
				}
				viewport={{ once: true }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="hero-content flex flex-col justify-center items-center md:flex-row h-[76vh] md:h-[max(30em,78vh)] md:min-h-fit lg:h-[81vh] p-8 lg:p-20 md:bg-none md:items-center"
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
					className={`hero-message flex flex-col w-full md:w-[35em] md:max-w-1/2 lg:w-full gap-5 md:p-8 justify-center`}
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
					className={`hero-icon md:flex md:w-1/2 hidden justify-center items-center`}
				>
					<Image
						className="h-[21.333em] w-[16em] hover:cursor-pointer hover:scale-[1.03] active:scale-[1.03] transition ease-out duration-200"
						onClick={() => {
							window.open("/ui/nativity-icon.jpg", "_blank");
						}}
						src="/ui/nativity-icon.jpg"
						alt={tCaptions("iconOfTheNativity")}
						title={tCaptions("iconOfTheNativity")}
						height={400}
						width={300}
						loading="eager"
					/>
				</motion.div>
			</motion.div>
		</section>
	);
} satisfies ModeledVoidComponent<HeroSectionModel>;

export default HeroSection;
