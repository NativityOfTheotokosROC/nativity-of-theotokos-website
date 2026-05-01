import { ModeledContainerComponent } from "@mvc-react/components";
import { ModalModel } from "../../models/modal";
import { InitializedModel } from "@mvc-react/mvc";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";

const Modal = function ({ model, children }) {
	const {
		modelView: { isOpen, title },
		interact,
	} = model;

	return (
		<Dialog
			open={isOpen}
			onClose={async () =>
				await interact({ type: "TOGGLE", input: { value: "close" } })
			}
			className="relative z-20"
			as="div"
		>
			<div
				className={`fixed inset-0 z-21 flex w-screen items-center justify-center p-4`}
			>
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-black/50 duration-400 ease-out data-closed:opacity-0"
				/>
				<DialogPanel
					className={`z-22 flex flex-col gap-0 overflow-clip rounded-lg border border-[#868686] bg-[#FEF8F3] text-black duration-300 ease-out data-closed:transform-[scale(92%)] data-closed:opacity-0 md:min-w-lg`}
					transition
				>
					<DialogTitle className="sr-only">{title}</DialogTitle>
					{children}
				</DialogPanel>
			</div>
		</Dialog>
	);
} satisfies ModeledContainerComponent<InitializedModel<ModalModel>>;

export default Modal;
