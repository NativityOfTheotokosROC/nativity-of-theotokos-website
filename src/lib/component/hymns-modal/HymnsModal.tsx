"use client";
import { ModeledVoidComponent } from "@mvc-react/components";
import { HymnsModalModel } from "../../model/hymns-modal";
import { InitializedModel } from "@mvc-react/mvc";
import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { georgia } from "../../third-party/fonts";
import { useTranslations } from "next-intl";
import { HymnsOrnament } from "../miscellaneous/graphic";

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
					className={`flex flex-col md:min-w-lg bg-[#FEF8F3] text-black border border-[#868686] rounded-lg overflow-clip gap-0 duration-300 ease-out data-closed:transform-[scale(92%)] data-closed:opacity-0 z-22`}
					transition
				>
					<DialogTitle className="sr-only">
						{t("hymnsForToday")}
					</DialogTitle>
					<div className="bg-gray-800 text-[#FEF8F3] border-0 p-4 rounded-none">
						<div className="ornament flex justify-center items-center w-full h-[4em] ">
							<HymnsOrnament className="object-contain object-center h-[4em] w-[8em] fill-[#FEF8F3]" />
						</div>
					</div>
					<div className="px-5 pt-6">
						<div className="max-h-[50dvh] [@media(height<=448px)]:max-h-[15dvh] overflow-y-auto data-closed:overflow-hidden">
							<div className="flex justify-center items-center px-2 bg-[#FEF8F3] text-black">
								<div className="flex flex-col justify-center items-center px-2 max-w-[25em]">
									{hymns.map((hymn, index) => (
										<div
											className="flex flex-col gap-3 text-center items-center justify-center"
											key={index}
										>
											<span
												className={`text-lg font-semibold ${georgia.className}`}
											>
												{hymn.title}
											</span>
											<p className="whitespace-pre-line m-0">
												{hymn.text.replaceAll(
													/\/\s+/g,
													"/\n",
												)}
											</p>
											<hr className="w-6/10 mt-4 mb-6 text-black/70 border-black/70" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div
						className={`bg-[#FEF8F3] text-black border-0 rounded-none p-0`}
					>
						<div className="flex justify-center items-center w-full p-5">
							<button
								className="bg-[#513433] text-white p-4 w-[8em] rounded-lg hover:bg-[#250203]/90 active:bg-[#250203]"
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
