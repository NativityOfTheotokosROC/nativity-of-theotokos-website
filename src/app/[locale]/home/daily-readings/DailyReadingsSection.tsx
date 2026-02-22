import DailySaintsWidget from "@/src/lib/component/daily-saints-widget/DailySaintsWidget";
import ScripturesWidget from "@/src/lib/component/scriptures-widget/ScripturesWidget";
import { DailyReadingsSectionModel } from "@/src/lib/model/daily-readings-section";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
const DailyReadingsSection = function ({ model }) {
	const { dailyReadings, hymnsModal } = model.modelView;
	const t = useTranslations("home");

	return (
		<section className="readings text-black border-t-15 border-t-[#976029] bg-[url(/ui/ornament_3_tr.svg)] bg-no-repeat bg-size-[13em,60em] md:bg-size-[30em,80em] bg-position-[98%_0.5%,40%_-30em] lg:bg-position-[100%_0.5%,750%_-40em]">
			<div className="readings-content flex flex-col gap-6 p-8 py-9 lg:px-20 md:py-10 max-w-360">
				<span
					className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
				>
					{t("dailyReadingsHeader")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				{dailyReadings ? (
					<>
						<div className="flex flex-col gap-y-6 md:gap-y-8 gap-x-8 lg:flex-row">
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
					<div className="flex md:flex-row gap-2 animate-pulse h-[20em] lg:w-9/10 md:mt-4 items-stretch">
						<div className="md:flex min-w-60 w-60 lg:min-w-70 lg:w-70 items-stretch justify-center p-3 hidden bg-black/20" />
						<div className="info flex flex-col grow bg-black/20" />
					</div>
				)}
			</div>
		</section>
	);
} satisfies ModeledVoidComponent<DailyReadingsSectionModel>;

export default DailyReadingsSection;
