import { StyledModeledComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { CalendarPlusIcon, SquarePenIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { QuoteModelView } from "../../models/quote";
import { twMerge } from "tailwind-merge";

const EditQuotePanel = function ({ model, className, style }) {
	const { quote, modifiers } = model.modelView;
	const t = useTranslations("manageQuotes");
	const id = quote.id;

	if (id === undefined) return <></>;

	return (
		<div className={twMerge("flex gap-3 text-xs", className)} style={style}>
			<button
				title={t("edit")}
				className="no-outline flex items-center"
				onClick={() => modifiers.editCallback(id)}
			>
				<SquarePenIcon className="size-5" strokeWidth={1.5} />
			</button>
			{modifiers.scheduleCallback && (
				<button
					title={t("scheduleNew")}
					className="no-outline flex items-center"
					onClick={() => modifiers.scheduleCallback!(id)}
				>
					<CalendarPlusIcon className="size-5" strokeWidth={1.5} />
				</button>
			)}
			<button
				title={t("delete")}
				className="no-outline flex items-center"
				onClick={() => modifiers.deleteCallback(id)}
			>
				<Trash2Icon className="size-5" strokeWidth={1.5} />
			</button>
		</div>
	);
} satisfies StyledModeledComponent<
	ReadonlyModel<Required<Pick<QuoteModelView, "quote" | "modifiers">>>
>;

export default EditQuotePanel;
