import { ModeledVoidComponent } from "@mvc-react/components";
import { UserActionModel } from "../../model/user-action";
import { useTranslations } from "next-intl";
import { usePageLoadingBarRouter } from "../page-loading-bar/navigation";
import { useRouter } from "@/src/i18n/navigation";
import { signOut } from "../../third-party/better-auth";

const UserAction = function ({ model }) {
	const { name } = model.modelView;
	const t = useTranslations("userAction");
	const router = usePageLoadingBarRouter(useRouter);

	switch (name) {
		case "NEW_ARTICLE": {
			return <></>; // TODO
		}
		case "NEW_QUOTE": {
			return (
				<button
					onClick={() => {
						router.push("/quotes/new");
					}}
				>
					{t("newQuote")}
				</button>
			);
		}
		case "SIGN_OUT": {
			return (
				<button
					onClick={() => {
						signOut(); // TODO
					}}
				>
					{t("signOut")}
				</button>
			);
		}
	}
} satisfies ModeledVoidComponent<UserActionModel>;

export default UserAction;
