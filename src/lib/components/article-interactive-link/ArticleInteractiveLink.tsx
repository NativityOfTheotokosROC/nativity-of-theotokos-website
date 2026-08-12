import { ModeledContainerComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { ArticleInteractiveLinkModel } from "../../models/article-interactive-link";
import { Link } from "../page-loading-bar/PageLoadingBar";

const ArticleInteractiveLink = function ({ model, children }) {
	const { title, link } = model.modelView;

	return (
		<Link title={title} href={link} target="_blank">
			{children}
		</Link>
	);
} satisfies ModeledContainerComponent<
	InitializedModel<ArticleInteractiveLinkModel>
>;

export default ArticleInteractiveLink;
