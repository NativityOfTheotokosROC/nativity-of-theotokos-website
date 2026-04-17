import { ModeledVoidComponent } from "@mvc-react/components";
import { ScripturesWidgetModel } from "../../models/sciptures-widget";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "motion/react";
import { georgia } from "../../third-party/fonts";
import ReadingsOrnament from "@/public/assets/ornament_1.svg";
import "./scriptures-widget.css";

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
			className="scripture-readings flex h-fit flex-col overflow-clip rounded-lg border border-gray-900/30 bg-[#FEF8F3] md:max-w-[70%] lg:min-w-[35%]"
		>
			<div className="flex w-full items-center justify-center gap-6 bg-gray-900 p-2 px-10 text-white md:items-center lg:items-center lg:justify-center">
				<ReadingsOrnament
					className={`h-[5em] w-[8em] object-contain object-center`}
					fill="#fff"
					opacity={0.9}
				/>
				<span
					className={`hidden w-full grow text-4xl md:inline lg:hidden ${georgia.className}`}
				>
					{t("readings")}
				</span>
			</div>
			<div className="fasting-info bg-gray-950 p-2.5 px-4 text-center text-white md:mt-0 md:px-10 md:text-left lg:text-center">
				<span className="text-base">{fastingInfo}</span>
			</div>
			<div className="flex max-h-[15em] min-h-[9em] bg-gray-700 p-6 text-white md:max-h-[11em] md:px-10 lg:px-6 [&_a]:underline [&_a]:hover:text-[#DCB042] [&_a]:hover:underline">
				<div className="scriptures flex grow flex-col gap-1 overflow-y-auto pr-3">
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
