import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";
import { UserActionModel } from "../../models/user-action";

const UserAction = function ({ model }) {
	const { name, action } = model.modelView;
	const t = useTranslations("userAction");

	switch (name) {
		case "NEW_QUOTE": {
			return <button onClick={action}>{t("newQuote")}</button>;
		}
		case "WRITE_ARTICLE": {
			return <button onClick={action}>{t("writeArticle")}</button>;
		}
		case "REVIEW_ARTICLE": {
			return <button onClick={action}>{t("reviewArticle")}</button>;
		}
		case "SIGN_OUT": {
			return <button onClick={action}>{t("signOut")}</button>;
		}
	}
} satisfies ModeledVoidComponent<UserActionModel>;

export default UserAction;
