import { useAutoCompleteBox } from "@/src/lib/model-implementations/auto-complete-box";
import { AssignArticleModel } from "@/src/lib/models/assign-article";
import { useArticleAuthorSchema } from "@/src/lib/validation/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import AutoCompleteBox from "../../auto-complete-box/AutoCompleteBox";
import Button from "../../button/Button";
import PageView from "../../page-view/PageView";
import Spinner from "../../spinner/Spinner";
import { autoCompleteFields } from "@/src/lib/utilities/auto-complete-box";
import { BLANK_TRANSLATION } from "@/src/lib/utilities/constants";

const AssignArticle = function ({ model }) {
	const { modelView, interact } = model;
	const { suggestions, notification } = modelView;
	const t = useTranslations("assignArticle");
	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: { name: BLANK_TRANSLATION, email: "" },
		resolver: zodResolver(useArticleAuthorSchema()),
	});
	const autoCompleteSelectCallback = (
		author: NonNullable<typeof suggestions>[number],
	) => {
		// Don't know why setValues is not working here
		setValue("name", author.name);
		setValue("email", author.email);
	};
	const englishAuthorNameAutoCompleteBox = useAutoCompleteBox(
		{
			id: "author-name",
			items: suggestions ?? [],
			transformer: author => author.name.english,
		},
		autoCompleteSelectCallback,
	);
	const authorEmailAutoCompleteBox = useAutoCompleteBox(
		{
			id: "author-email",
			items: suggestions ?? [],
			transformer: author => author.email,
		},
		autoCompleteSelectCallback,
	);
	const englishAuthorNameFields = autoCompleteFields(
		englishAuthorNameAutoCompleteBox,
	);
	const authorEmailFields = autoCompleteFields(authorEmailAutoCompleteBox);

	return (
		<>
			{suggestions && (
				<>
					<AutoCompleteBox model={englishAuthorNameAutoCompleteBox} />
					<AutoCompleteBox model={authorEmailAutoCompleteBox} />
				</>
			)}
			<PageView model={newReadonlyModel({ title: t("metaTitle") })}>
				<form
					onSubmit={handleSubmit(async form => {
						await interact({
							type: "ASSIGN_ARTICLE",
							input: {
								author: form,
								successCallback() {
									reset();
								},
							},
						});
					})}
				>
					<div className="flex flex-col gap-3 md:max-w-1/2 lg:max-w-1/3">
						<Controller
							name="name.english"
							control={control}
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.name ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("authorNameField")}
									autoCapitalize="words"
									name={name}
									value={value}
									autoComplete={
										englishAuthorNameFields.autoComplete
									}
									data-tooltip-id={
										englishAuthorNameFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										englishAuthorNameFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										englishAuthorNameFields.onBlur();
									}}
								/>
							)}
						/>
						{errors?.name && (
							<span className="text-sm text-red-800">
								{errors.name.message}
							</span>
						)}
						<Controller
							name="email"
							control={control}
							render={({
								field: { onChange, onBlur, name, value },
							}) => (
								<input
									className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.email ? "border-red-800" : "border-gray-400"}`}
									placeholder={t("emailField")}
									type="email"
									name={name}
									value={value}
									autoComplete={
										authorEmailFields.autoComplete
									}
									data-tooltip-id={
										authorEmailFields.dataTooltipId
									}
									onChange={e => {
										onChange(e);
										authorEmailFields.onChange(
											e.target.value,
										);
									}}
									onBlur={() => {
										onBlur();
										authorEmailFields.onBlur();
									}}
								/>
							)}
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
