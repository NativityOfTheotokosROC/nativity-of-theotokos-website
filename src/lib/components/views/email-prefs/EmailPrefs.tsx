import {
	EmailPrefs as EmailPrefsType,
	EmailPrefsModel,
} from "@/src/lib/models/email-prefs";
import { getEmailPrefsSchema } from "@/src/lib/validation/email-prefs";
import { useLocalizedSchema } from "@/src/lib/validation/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import ButtonBar from "../../button-bar/ButtonBar";
import Button from "../../button/Button";
import PageView from "../../page-view/PageView";
import RadioGroup from "../../radio-group/RadioGroup";

const EmailPrefs = function ({ model }) {
	const {
		modelView: {
			contact: { id, email },
			prefs: { isUnsubscribed, preferredLang, firstName, lastName },
		},
		interact,
	} = model;
	const locale = useLocale();
	const t = useTranslations("emailPrefs");
	const tMisc = useTranslations("miscellaneous");
	const emailPrefsSchema = useLocalizedSchema(getEmailPrefsSchema);
	const languagesMap = useMemo(
		() =>
			new Map<EmailPrefsType["preferredLang"], string>([
				["en", tMisc("english")],
				["ru", tMisc("russian")],
			]),
		[tMisc],
	);
	const {
		handleSubmit,
		control,
		formState: { isSubmitting, isDirty, errors },
		register,
	} = useForm({
		resolver: zodResolver(emailPrefsSchema),
		defaultValues: {
			isUnsubscribed: isUnsubscribed ?? false,
			preferredLang: preferredLang ?? locale,
			firstName: firstName ?? "",
			lastName: lastName ?? "",
		},
	});

	return (
		<PageView
			model={newReadonlyModel({
				title: t("title"),
			})}
		>
			<form className="email-prefs-form">
				<div className="flex flex-col gap-4 md:w-3/4 lg:w-6/10">
					<span className="uppercase">{t("nameSection")}</span>
					<div className="flex flex-col gap-3">
						<input
							{...register("firstName")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.firstName ? "border-red-800" : "border-gray-400"}`}
							placeholder={`${t("firstName")} (${tMisc("optional")})`}
							autoCapitalize="words"
						/>
						{errors.firstName && (
							<span className="text-sm text-red-800">
								{errors.firstName.message}
							</span>
						)}
						<input
							{...register("lastName")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.lastName ? "border-red-800" : "border-gray-400"}`}
							placeholder={`${t("lastName")} (${tMisc("optional")})`}
							autoCapitalize="words"
						/>
						{errors.lastName && (
							<span className="text-sm text-red-800">
								{errors.lastName.message}
							</span>
						)}
					</div>
					<span className="uppercase">{t("preferredLanguage")}</span>
					<Controller
						control={control}
						name={"preferredLang"}
						render={({ field: { onChange, value } }) => {
							const text = languagesMap.get(value!)!;
							return (
								<RadioGroup
									model={newReadonlyModel({
										selected: { id: value!, text },
										items: languagesMap
											.entries()
											.map(([id, text]) => ({ id, text }))
											.toArray(),
										selectedChangedCallback(selected) {
											onChange(selected.id);
										},
										options: {
											orientation: "vertical",
										},
									})}
								/>
							);
						}}
					/>
					<ButtonBar
						model={newReadonlyModel({
							arrangement: "start",
							orientation: "horizontal",
						})}
					>
						<Button
							model={newReadonlyModel({
								action: () =>
									interact({
										type: "TOGGLE_SUBSCRIBE",
										input: { value: !isUnsubscribed },
									}),
								disabled: isSubmitting,
							})}
							className="min-w-[8em]"
						>
							{isUnsubscribed ? t("subscribe") : t("unsubscribe")}
						</Button>
						<Button
							model={newReadonlyModel({
								disabled: !isDirty || isSubmitting,
								type: "submit",
							})}
							className="min-w-[8em]"
						>
							{t("savePreferences")}
						</Button>
					</ButtonBar>
				</div>
			</form>
		</PageView>
	);
} satisfies ModeledVoidComponent<InitializedModel<EmailPrefsModel>>;

export default EmailPrefs;
