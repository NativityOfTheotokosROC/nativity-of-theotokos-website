import { AssignArticleModel } from "@/src/lib/models/assign-article";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import PageView from "../../page-view/PageView";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssignArticleFormSchema } from "@/src/lib/validation/assign-article-form";
import Button from "../../button/Button";
import Spinner from "../../spinner/Spinner";
import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import AutoCompleteBox from "../../auto-complete-box/AutoCompleteBox";

const AssignArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { suggestions, notification } = modelView;
	const t = useTranslations("assignArticle");
	const {
		register,
		handleSubmit,
		setValues,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: { name: "", email: "" },
		resolver: zodResolver(useAssignArticleFormSchema()),
	});
	// TODO: It's been a run we start from here next time
	const authorNamesAutoCompleteBox = useAutoCompleteBox({
		id: "author-name",
		isOpen: false,
		items: suggestions?.map(author => author.name) ?? [],
		query: "",
		selectCallback: value => {
			setValues({
				name: value,
				email: suggestions!.filter(author => author.name === value)[0]
					.email,
			});
		},
	});
	const authorEmailsAutoCompleteBox = useAutoCompleteBox({
		id: "author-email",
		isOpen: false,
		items: suggestions?.map(author => author.email) ?? [],
		query: "",
		selectCallback: value => {
			setValues({
				email: value,
				name: suggestions!.filter(author => author.email === value)[0]
					.name,
			});
		},
	});

	return (
		<>
			{suggestions && (
				<>
					<AutoCompleteBox model={authorNamesAutoCompleteBox} />
					<AutoCompleteBox model={authorEmailsAutoCompleteBox} />
				</>
			)}
			<PageView model={newReadonlyModel({ title: t("metaTitle") })}>
				<form
					onSubmit={handleSubmit(async form => {
						await interact({
							type: "ASSIGN_ARTICLE",
							input: {
								author: { name: form.name, email: form.email },
								async successCallback() {
									reset();
								},
							},
						});
					})}
				>
					<div className="flex flex-col gap-3 md:max-w-1/2 lg:max-w-1/3">
						<input
							{...register("name")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("authorNameField")}
							autoComplete="off"
							autoCapitalize="words"
							data-tooltip-id={
								authorNamesAutoCompleteBox.modelView.id
							}
							onChange={async e => {
								register("name").onChange(e);
								await authorNamesAutoCompleteBox.interact({
									type: "TOGGLE",
									input: {
										value:
											e.target.value.trim() === ""
												? "close"
												: "open",
									},
								});
								await authorNamesAutoCompleteBox.interact({
									type: "FILTER",
									input: {
										query: e.target.value,
									},
								});
							}}
							onBlur={() =>
								authorNamesAutoCompleteBox.interact({
									type: "TOGGLE",
									input: {
										value: "close",
									},
								})
							}
						/>
						{errors.name && (
							<span className="text-sm text-red-800">
								{errors.name.message}
							</span>
						)}
						<input
							{...register("email")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.email ? "border-red-800" : "border-gray-400"}`}
							placeholder={t("emailField")}
							autoComplete="off"
							type="email"
							data-tooltip-id={
								authorEmailsAutoCompleteBox.modelView.id
							}
							onChange={async e => {
								register("email").onChange(e);
								await authorEmailsAutoCompleteBox.interact({
									type: "TOGGLE",
									input: {
										value:
											e.target.value.trim() === ""
												? "close"
												: "open",
									},
								});
								await authorEmailsAutoCompleteBox.interact({
									type: "FILTER",
									input: {
										query: e.target.value,
									},
								});
							}}
							onBlur={() =>
								authorEmailsAutoCompleteBox.interact({
									type: "TOGGLE",
									input: {
										value: "close",
									},
								})
							}
						/>
						{errors.email && (
							<span className="text-sm text-red-800">
								{errors.email.message}
							</span>
						)}
						<hr className="mt-10 w-full" />
						<Button
							model={newReadonlyModel({
								type: "submit",
								disabled:
									isSubmitting ||
									notification?.type === "submitting",
								className: "min-w-[8em]",
							})}
						>
							{notification?.type === "submitting" ? (
								<Spinner
									model={newReadonlyModel({
										color: "white",
										size: 20,
									})}
								/>
							) : (
								t("assignArticle")
							)}
						</Button>
					</div>
				</form>
			</PageView>
		</>
	);
} satisfies ModeledVoidComponent<InitializedModel<AssignArticleModel>>;

export default AssignArticle;
