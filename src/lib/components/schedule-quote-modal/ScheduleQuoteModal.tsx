import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { ScheduleQuoteModalModel } from "../../models/schedule-quote-modal";
import Modal from "../modal/Modal";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { pickTranslation, truncateText } from "../../utilities/miscellaneous";
import { getDateString } from "../../utilities/date-time";
import { addDays } from "date-fns";
import ButtonBar from "../button-bar/ButtonBar";
import Button from "../button/Button";
import Spinner from "@/src/lib/components/spinner/Spinner";

const ScheduleQuoteModal = function ({ model }) {
	const t = useTranslations("scheduleQuoteModal");
	const locale = useLocale();
	const { modelView, interact } = model;
	const currentDate = getDateString(new Date());
	const isToReschedule = !(modelView?.quote.date === undefined);
	const title = isToReschedule
		? t("rescheduleQuoteTitle")
		: t("scheduleQuoteTitle");
	const {
		handleSubmit,
		reset,
		formState: { isSubmitting, errors },
		register,
	} = useForm({
		resolver: zodResolver(
			z.object({
				date: z.iso.date(),
			}),
		),
		defaultValues: {
			date: getDateString(addDays(new Date(currentDate), 1)),
		},
	});

	return (
		<Modal
			model={newReadonlyModel({
				isOpen: modelView?.isOpen ?? false,
				onClose: () => interact({ type: "CLOSE" }),
				size: "small",
				variant: "titled",
				title,
			})}
		>
			<div className="flex w-full flex-col items-center justify-center">
				{modelView && (
					<form
						className="flex flex-col gap-6 p-6"
						onSubmit={handleSubmit(async form => {
							await interact({
								type: "SCHEDULE_QUOTE",
								input: {
									date: form.date,
									quoteId: modelView.quote.id,
									oldDate: modelView.quote.date
										? getDateString(
												modelView.quote.date,
												true,
											)
										: undefined,
								},
							});
							await interact({ type: "CLOSE" });
							reset();
						})}
					>
						<p>
							{t("description", {
								quote: truncateText(
									pickTranslation(
										modelView.quote.quote,
										locale,
									),
									100,
								),
								author: pickTranslation(
									modelView.quote.author.name,
									locale,
								),
							})}
						</p>
						<input
							{...register("date")}
							lang={locale}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.date ? "border-red-800" : "border-gray-400"}`}
							type="date"
							formNoValidate
							min={currentDate}
						/>
						<ButtonBar
							model={newReadonlyModel({
								orientation: "horizontal",
								arrangement: "center",
								className: "w-full",
							})}
						>
							<Button
								model={newReadonlyModel({
									disabled: isSubmitting,
									action: () => interact({ type: "CLOSE" }),
								})}
								className="min-w-[8em]"
							>
								{t("cancel")}
							</Button>
							<Button
								model={newReadonlyModel({
									type: "submit",
									disabled: isSubmitting,
								})}
								className="min-w-[8em]"
							>
								{isSubmitting ? (
									<Spinner
										model={newReadonlyModel({
											color: "white",
											size: 20,
										})}
									/>
								) : isToReschedule ? (
									t("reschedule")
								) : (
									t("schedule")
								)}
							</Button>
						</ButtonBar>
					</form>
				)}{" "}
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<ScheduleQuoteModalModel>;

export default ScheduleQuoteModal;
