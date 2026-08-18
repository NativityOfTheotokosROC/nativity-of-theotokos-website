import { ModeledContainerComponent } from "@mvc-react/components";
import { ModalModel } from "../../models/modal";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { Suspense } from "react";
import Spinner from "../spinner/Spinner";

const Modal = function ({ model, children }) {
	const {
		modelView: { isOpen, title, onClose },
	} = model;

	return (
		<Dialog
			open={isOpen}
			onClose={async () => await onClose()}
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
					className={`z-22 flex w-full flex-col gap-0 overflow-clip rounded-lg border border-[#868686] bg-[#FEF8F3] text-black duration-300 ease-out data-closed:transform-[scale(92%)] data-closed:opacity-0 md:max-w-2xl md:min-w-lg lg:max-w-5xl`}
					transition
				>
					<DialogTitle className="sr-only">{title}</DialogTitle>
					<Suspense
						fallback={
							<div className="flex min-h-64 min-w-64 items-center justify-center">
								<Spinner
									model={newReadonlyModel({
										color: "#5555580",
										size: 30,
									})}
								/>
							</div>
						}
					>
						{children}
					</Suspense>
				</DialogPanel>
			</div>
		</Dialog>
	);
} satisfies ModeledContainerComponent<InitializedModel<ModalModel>>;

export default Modal;
