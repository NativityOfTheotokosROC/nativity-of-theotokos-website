import DailySaintsWidget from "@/src/lib/components/daily-saints-widget/DailySaintsWidget";
import ScripturesWidget from "@/src/lib/components/scriptures-widget/ScripturesWidget";
import { DailyReadingsSectionModel } from "@/src/lib/models/daily-readings-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";

const DailyReadingsSection = function ({ model }) {
	const { dailyReadings, hymnsModal } = model.modelView;
	const t = useTranslations("home");

	return (
		<section
			style={{ backgroundImage: `url(/assets/ornament_3_tr.svg)` }} // TODO: Revisit
			className="readings border-t-15 border-t-[#976029] bg-size-[13em,60em] bg-position-[98%_0.5%,40%_-30em] bg-no-repeat text-black md:bg-size-[30em,80em] lg:bg-position-[100%_0.5%,750%_-40em]"
		>
			<div className="readings-content flex max-w-360 flex-col gap-6 p-8 py-9 md:py-10 lg:px-20">
				<span
					className={`mb-2 w-3/4 text-[2.75rem]/tight font-semibold md:w-1/2 md:text-black ${georgia.className}`}
				>
					{t("dailyReadingsHeader")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				{dailyReadings ? (
					<>
						<div className="flex flex-col gap-x-8 gap-y-6 md:gap-y-8 lg:flex-row">
							<DailySaintsWidget
								model={newReadonlyModel({
									details: dailyReadings,
									hymnsModal,
								})}
							/>
							<ScripturesWidget
								model={newReadonlyModel({
									details: dailyReadings,
								})}
							/>
						</div>
					</>
				) : (
					<div className="flex h-[20em] animate-pulse items-stretch gap-2 md:mt-4 md:flex-row lg:w-9/10">
						<div className="hidden w-60 min-w-60 items-stretch justify-center bg-black/20 p-3 md:flex lg:w-70 lg:min-w-70" />
						<div className="info flex grow flex-col bg-black/20" />
					</div>
				)}
			</div>
		</section>
	);
} satisfies ModeledVoidComponent<DailyReadingsSectionModel>;

export default DailyReadingsSection;
