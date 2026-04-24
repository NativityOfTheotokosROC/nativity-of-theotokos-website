"use client";
import { ModeledVoidComponent } from "@mvc-react/components";
import { HymnsModalModel } from "../../models/hymns-modal";
import { InitializedModel } from "@mvc-react/mvc";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { georgia } from "../../third-party/fonts";
import { useTranslations } from "next-intl";
import HymnsOrnament from "@/public/assets/ornament_9.svg";

const HymnsModal = function ({ model }) {
	const { modelView, interact } = model;
	const { isOpen, hymns } = modelView;
	const t = useTranslations("hymnsModal");

	return (
		<Dialog
			open={isOpen}
			onClose={async () => await interact({ type: "CLOSE" })}
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
					<DialogTitle className="sr-only">
						{t("hymnsForToday")}
					</DialogTitle>
					<div className="rounded-none border-0 bg-gray-800 p-4 text-[#FEF8F3]">
						<div className="ornament flex h-[4em] w-full items-center justify-center">
							<HymnsOrnament className="h-[4em] w-[8em] fill-[#FEF8F3] object-contain object-center" />
						</div>
					</div>
					<div className="px-5 pt-6">
						<div className="max-h-[50dvh] overflow-y-auto data-closed:overflow-hidden [@media(height<=448px)]:max-h-[15dvh]">
							<div className="flex items-center justify-center bg-[#FEF8F3] px-2 text-black">
								<div className="flex max-w-[25em] flex-col items-center justify-center px-2">
									{hymns.map((hymn, index) => (
										<div
											className="flex flex-col items-center justify-center gap-3 text-center"
											key={index}
										>
											<span
												className={`text-lg font-semibold ${georgia.className}`}
											>
												{hymn.title}
											</span>
											<p className="m-0 whitespace-pre-line">
												{hymn.text.replaceAll(
													/\/\s+/g,
													"/\n",
												)}
											</p>
											<hr className="mt-4 mb-6 w-6/10 border-black/70 text-black/70" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div
						className={`rounded-none border-0 bg-[#FEF8F3] p-0 text-black`}
					>
						<div className="flex w-full items-center justify-center p-5">
							<button
								className="w-[8em] rounded-lg bg-[#513433] p-4 text-white hover:bg-[#250203]/90 active:bg-[#250203]"
								onClick={async () => {
									await interact({ type: "CLOSE" });
								}}
							>
								{t("closeButton")}
							</button>
						</div>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
} as ModeledVoidComponent<InitializedModel<HymnsModalModel>>;

export default HymnsModal;
