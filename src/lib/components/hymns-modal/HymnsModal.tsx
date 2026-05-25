import HymnsOrnament from "@/public/assets/ornament_9.svg";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { HymnsModalModel } from "../../models/hymns-modal";
import { ModalModel } from "../../models/modal";
import { georgia } from "../../third-party/fonts";
import Modal from "../modal/Modal";

const HymnsModal = function ({ model }) {
	const { modelView, interact } = model;
	const { isOpen, hymns } = modelView;
	const t = useTranslations("hymnsModal");
	const modal = {
		modelView: {
			isOpen,
			title: t("hymnsForToday"),
		},
		async interact(interaction) {
			switch (interaction.type) {
				case "TOGGLE": {
					const value = interaction.input.value;
					if (value == "open")
						return await model.interact({
							type: "OPEN",
							input: { hymns },
						});
					if (value == "close")
						return await model.interact({ type: "CLOSE" });
				}
			}
		},
	} satisfies ModalModel;

	return (
		<Modal model={modal}>
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
										{hymn.text.replaceAll(/\/\s+/g, "/\n")}
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
		</Modal>
	);
} as ModeledVoidComponent<InitializedModel<HymnsModalModel>>;

export default HymnsModal;
