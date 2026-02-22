import { ModeledVoidComponent } from "@mvc-react/components";
import { ScripturesWidgetModel } from "../../model/sciptures-widget";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "motion/react";
import { georgia } from "../../third-party/fonts";
import { ReadingsOrnament } from "../miscellaneous/graphic";

const ScripturesWidget = function ({ model }) {
	const { fastingInfo, scriptures } = model.modelView.details;
	const t = useTranslations("home");

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.1 }}
			transition={{
				ease: "easeOut",
			}}
			className="scripture-readings h-fit flex flex-col bg-[#FEF8F3] border border-gray-900/30 md:max-w-[70%] lg:min-w-[35%] rounded-lg overflow-clip"
		>
			<div className="flex gap-6 w-full items-center justify-center lg:justify-center md:items-center lg:items-center p-2 px-10 text-white bg-gray-900">
				<ReadingsOrnament
					className={`object-contain object-center h-[5em] w-[8em]`}
					fill="#fff"
					opacity={0.9}
				/>
				<span
					className={`grow w-full hidden md:inline lg:hidden text-4xl ${georgia.className}`}
				>
					{t("readings")}
				</span>
			</div>
			<div className="fasting-info bg-gray-950 text-white text-center md:text-left lg:text-center p-2.5 px-4 md:px-10 md:mt-0">
				<span className="text-base">{fastingInfo}</span>
			</div>
			<div className="flex p-6 md:px-10 lg:px-6 bg-gray-700 text-white [&_a]:underline [&_a]:hover:underline [&_a]:hover:text-[#DCB042] max-h-[15em] min-h-[9em] md:max-h-[11em]">
				<div className="scriptures grow flex flex-col gap-1 pr-3 overflow-y-auto">
					{[
						...scriptures.map((scripture, index) => (
							<div
								key={index}
								className="grid grid-cols-2 gap-x-4"
							>
								<span className="w-fit">
									<Link href={scripture.link} target="_blank">
										{scripture.scriptureText}
									</Link>
								</span>
								{scripture.designation && (
									<span className="wrap-break-word hyphens-auto">
										{scripture.designation}
									</span>
								)}
							</div>
						)),
					]}
				</div>
			</div>
		</motion.div>
	);
} satisfies ModeledVoidComponent<ScripturesWidgetModel>;

export default ScripturesWidget;
