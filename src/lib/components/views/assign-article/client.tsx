import { useAssignArticle } from "@/src/lib/model-implementations/assign-article";
import { useToastNotifier } from "@/src/lib/model-implementations/notifier";
import { AssignArticleModelView } from "@/src/lib/models/assign-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import AssignArticle from "./AssignArticle";

const AssignArticleClient = function ({ model }) {
	const { suggestions } = model.modelView;
	const toastNotifier = useToastNotifier();
	const assignArticle = useAssignArticle({ suggestions, toastNotifier });

	return <AssignArticle model={assignArticle} />;
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ suggestions: AssignArticleModelView["suggestions"] }>
>;

export default AssignArticleClient;
