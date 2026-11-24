import { ArticleAuthorModel } from "@/src/lib/models/article-author";
import {
	ArticleAuthor as ArticleAuthorType,
	Translation,
} from "@/src/lib/utilities/types";
import {
	getArticleAuthorSchema,
	NewArticleAuthor,
} from "@/src/lib/validation/article";
import { useLocalizedSchema } from "@/src/lib/validation/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import PageView from "../../page-view/PageView";
import Spinner from "../../spinner/Spinner";
import Button from "../../button/Button";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";
import { useConfirmationDialog } from "@/src/lib/model-implementations/confirmation-dialog";
import ConfirmationDialog from "../../confirmation-dialog/ConfirmationDialog";

const ArticleAuthor = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("articleAuthor");
	const tMisc = useTranslations("miscellaneous");
	const articleAuthorSchema = useLocalizedSchema(getArticleAuthorSchema);
	const {
		handleSubmit,
		reset,
		control,
		register,
		formState: { isSubmitting, errors },
	} = useForm({
		resolver: zodResolver(articleAuthorSchema),
		defaultValues: getDefaultValues(modelView?.author),
	});
	const confirmationDialog = useConfirmationDialog();

	return (
		<>
			<ConfirmationDialog model={confirmationDialog} />
			<PageView model={newReadonlyModel({ title: t("title") })}>
				<form
					onSubmit={handleSubmit(async form => {
						await interact({
							type: "ADD_AUTHOR",
							input: {
								author: form,
								successCallback(newAuthor) {
									reset(getDefaultValues(newAuthor));
								},
							},
						});
					})}
				>
					<div className="flex flex-col gap-3 md:max-w-1/2 lg:max-w-1/3">
						<>
							<input
								{...register("name.english")}
								lang="en"
								className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name?.english ? "border-red-800" : "border-gray-400"}`}
								placeholder={t("nameField")}
								autoCapitalize="words"
							/>
							{errors.name?.english && (
								<span className="text-sm text-red-800">
									{errors.name.english.message}
								</span>
							)}
						</>
						<>
							<input
								{...register("name.russian")}
								lang="ru"
								className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name?.english ? "border-red-800" : "border-gray-400"}`}
								placeholder={`${t("nameField")} (${tMisc("russian")})`}
								autoCapitalize="words"
							/>
							{errors.name?.english && (
								<span className="text-sm text-red-800">
									{errors.name.english.message}
								</span>
							)}
						</>
						<>
							<input
								{...register("email")}
								className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.email ? "border-red-800" : "border-gray-400"}`}
								placeholder={t("email")}
								type="email"
							/>
							{errors.email && (
								<span className="text-sm text-red-800">
									{errors.email.message}
								</span>
							)}
						</>
						<hr className="mt-10 w-full" />
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
							) : modelView?.author ? (
								t("updateAuthor")
							) : (
								t("addAuthor")
							)}
						</Button>
					</div>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<ArticleAuthorModel>;

export default ArticleAuthor;

function getDefaultValues(author?: ArticleAuthorType<Translation>) {
	return {
		name: author?.name ?? BLANK_TRANSLATION,
		email: author?.email ?? "",
		profile: {
			description: author?.profile?.description ?? BLANK_TRANSLATION,
			picture: author?.profile?.picture?.source ?? "",
			contactEmail: author?.profile?.contactEmail ?? "",
		},
	} satisfies NewArticleAuthor;
}
