import { zodResolver } from "@hookform/resolvers/zod";
import { ModeledVoidComponent } from "@mvc-react/components";
import { newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { InsertLinkModalModel } from "../../models/insert-link-modal";
import { getInsertLinkSchema } from "../../validation/miscellaneous";
import { useLocalizedSchema } from "../../validation/utilities";
import ButtonBar from "../button-bar/ButtonBar";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import { useEffect } from "react";

const InsertLinkModal = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("insertLinkModal");
	const tMisc = useTranslations("miscellaneous");
	const {
		handleSubmit,
		formState: { errors },
		reset,
		register,
	} = useForm({
		resolver: zodResolver(useLocalizedSchema(getInsertLinkSchema)),
	});

	useEffect(() => {
		reset({
			label: "",
			url: modelView?.initialLinkDetails?.url ?? "",
		});
	}, [reset, modelView]);

	return (
		<Modal
			model={newReadonlyModel({
				isOpen: modelView?.isOpen ?? false,
				onClose: () => interact({ type: "CLOSE" }),
				size: "small",
				variant: "titled",
				title: t("title"),
			})}
		>
			<div className="flex w-full flex-col items-center justify-center">
				{modelView && (
					<form
						className="flex w-full flex-1 flex-col gap-4 p-6"
						onSubmit={e => {
							e.stopPropagation();
							return handleSubmit(async form => {
								await interact({
									type: "INSERT_LINK",
									input: form,
								});
								await interact({ type: "CLOSE" });
							});
						}}
					>
						{!modelView.initialLinkDetails?.selectionExists && (
							<input
								{...register("label")}
								className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.label ? "border-red-800" : "border-gray-400"}`}
								placeholder={`${t("labelFieldAlt")} (${tMisc("optional")})`}
								autoCapitalize="none"
								autoComplete="on"
							/>
						)}
						<input
							{...register("url")}
							className={`w-full overflow-clip rounded-lg border bg-white p-4 ${errors.url ? "border-red-800" : "border-gray-400"}`}
							placeholder={`${t("linkFieldAlt")} (https://example.com)`}
							type={"url"}
							autoComplete="on"
							autoFocus
						/>
						{errors.url && (
							<span className="text-sm text-red-800">
								{errors.url.message}
							</span>
						)}
						<ButtonBar
							model={newReadonlyModel({
								orientation: "horizontal",
								arrangement: "center",
								className: "w-full mt-3",
							})}
						>
							<Button
								model={newReadonlyModel({
									action: () => interact({ type: "CLOSE" }),
								})}
								className="min-w-[8em]"
							>
								{t("cancel")}
							</Button>
							<Button
								model={newReadonlyModel({
									type: "submit",
								})}
								className="min-w-[8em]"
							>
								{t("insertLink")}
							</Button>
						</ButtonBar>
					</form>
				)}
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<InsertLinkModalModel>;

export default InsertLinkModal;
