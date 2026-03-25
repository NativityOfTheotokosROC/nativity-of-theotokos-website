import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";
import { UserActionModel } from "../../model/user-action";

const UserAction = function ({ model }) {
	const { name, action } = model.modelView;
	const t = useTranslations("userAction");
	// const router = usePageLoadingBarRouter(useRouter);

	switch (name) {
		case "NEW_ARTICLE": {
			return <></>; // TODO
		}
		case "NEW_QUOTE": {
			return <button onClick={action}>{t("newQuote")}</button>;
		}
		case "SIGN_OUT": {
			//TODO
			return <button onClick={action}>{t("signOut")}</button>;
		}
	}
} satisfies ModeledVoidComponent<UserActionModel>;

export default UserAction;
