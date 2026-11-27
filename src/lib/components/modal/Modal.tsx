import {
	CloseButton,
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { ModeledComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { ModalModel } from "../../models/modal";

import LogoIcon from "@/public/assets/logo-icon.svg";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";

const Modal = function ({ model, children }) {
	const {
		modelView: { isOpen, title, onClose, size, position, variant },
	} = model;
	const tNonDescriptive = useTranslations("nonDescriptive");

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			className="relative z-20"
			as="div"
		>
			<div
				className={`fixed inset-0 z-21 flex w-screen ${position ?? "items-center"} ${position === "center" ? "items-center" : position === "top" ? "items-start" : ""} justify-center p-4`}
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/50 duration-400 ease-out data-closed:opacity-0"
				/>
				<DialogPanel
					className={`@container z-22 flex h-fit max-h-full w-full overflow-y-auto ${size === "smallest" ? "md:w-100" : size === "small" ? "md:w-md" : size === "medium" ? "md:w-lg" : size === "large" ? "md:w-full" : ""} flex-col gap-0 overflow-clip rounded-lg border border-[#868686] bg-[#FEF8F3] text-black duration-300 ease-out data-closed:transform-[scale(92%)] data-closed:opacity-0 md:max-w-2xl lg:max-w-5xl`}
					transition
				>
					<DialogTitle className="sr-only">{title}</DialogTitle>
					{(variant === "titled" ||
						variant === "titled-with-close") && (
						<div className="flex w-full items-center justify-between rounded-none border-0 bg-gray-800 p-6 text-[#FEF8F3]">
							<div className="flex items-center gap-3">
								<div className="size-10">
									<LogoIcon
										className="logo-icon object-contain object-center"
										width={40}
										height={40}
										strokeWidth={9}
									/>
								</div>
								<span className="text-lg">{title}</span>
							</div>
							{variant === "titled-with-close" && (
								<CloseButton
									title={tNonDescriptive("close")}
									className={`flex items-center justify-center hover:text-[#ffdc4f]`}
								>
									<XIcon
										className="size-8"
										strokeWidth={1.75}
									/>
								</CloseButton>
							)}
						</div>
					)}
					{children}
				</DialogPanel>
			</div>
		</Dialog>
	);
} satisfies ModeledComponent<InitializedModel<ModalModel>>;

export default Modal;
