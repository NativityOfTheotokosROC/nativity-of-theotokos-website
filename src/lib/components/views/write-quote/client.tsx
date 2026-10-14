"use client";

import { useNewQuote } from "@/src/lib/model-implementations/write-quote";
import WriteQuote from "./WriteQuote";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel, ReadonlyModel } from "@mvc-react/mvc";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { AutoCompleteInfo } from "@/src/lib/models/write-quote";
import { useTranslations } from "next-intl";
import PageView from "../../page-view/PageView";

const WriteQuoteClient = function ({ model }) {
	const { autoCompleteInfo } = model.modelView;
	const toastNotifier = useToastNotifier();
	const t = useTranslations("newQuote");
	const writeQuote = useNewQuote({ autoCompleteInfo, toastNotifier });
	return (
		<PageView
			model={newReadonlyModel({
				title: t("title"),
				topBarColor: "#976029",
			})}
		>
			<WriteQuote model={writeQuote} />
		</PageView>
	);
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ autoCompleteInfo?: AutoCompleteInfo }>
>;

export default WriteQuoteClient;
