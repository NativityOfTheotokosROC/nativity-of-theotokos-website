import { ModeledVoidComponent } from "@mvc-react/components";
import { useTranslations } from "next-intl";
import { ConfirmationDialogModel } from "../../models/confirmation-dialog";
import { ModalModel } from "../../models/modal";
import Modal from "../modal/Modal";
import ConfirmationDialogOrnament from "@/public/assets/ornament_21.svg";
import { newReadonlyModel } from "@mvc-react/mvc";
import ButtonBar from "../button-bar/ButtonBar";
import Button from "../button/Button";

const ConfirmationDialog = function ({ model }) {
	const { modelView, interact } = model;
	const t = useTranslations("confirmationDialog");
	const isOpen = modelView?.isOpen ?? false;
	const title = modelView?.options?.title ?? t("defaultTitle");
	const message = modelView?.message ?? "";
	const proceedButtonText =
		modelView?.options?.proceedButtonText ?? t("defaultProceedButton");
	const cancelButtonText =
		modelView?.options?.cancelButtonText ?? t("defaultCancelButton");

	return (
		<Modal
			model={newReadonlyModel({
				isOpen,
				title,
				size: "smallest",
				position: "top",
				async onClose() {
					await interact({ type: "CANCEL" });
				},
			})}
		>
			<div className="flex w-full flex-col items-center">
				<div className="mb-4 w-full rounded-none border-0 bg-gray-800 p-4 text-[#FEF8F3]">
					{/* //TODO: Accommodate useTitleHeading option */}
					<div className="ornament flex h-[4em] w-full items-center justify-center">
						<ConfirmationDialogOrnament className="h-[4em] w-[8em] fill-[#FEF8F3] object-contain object-center" />
					</div>
				</div>
				<div className="message-box flex max-h-[33svh] min-h-[5em] w-full items-center overflow-y-auto p-4">
					<span>{message}</span>
				</div>
				<ButtonBar
					model={newReadonlyModel({
						arrangement: "center",
						orientation: "horizontal",
						className: "p-5",
					})}
				>
					<Button
						model={newReadonlyModel({
							action: async () =>
								await interact({ type: "CANCEL" }),
						})}
					>
						{cancelButtonText}
					</Button>
					<Button
						model={newReadonlyModel({
							action: async () =>
								await interact({ type: "PROCEED" }),
						})}
					>
						{proceedButtonText}
					</Button>
				</ButtonBar>
			</div>
		</Modal>
	);
} satisfies ModeledVoidComponent<ConfirmationDialogModel>;

export default ConfirmationDialog;
