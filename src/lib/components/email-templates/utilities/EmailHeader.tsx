import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import { Img } from "react-email";
import { BASE_URL } from "@/src/lib/utilities/server-constants";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });
	console.log("Rendering header");

	return (
		<header
			className={`email-header flex h-fit w-full max-w-full flex-col bg-gray-900`}
		>
			<div className="header-content flex items-center justify-center p-4 text-white lg:p-6 lg:px-7">
				<a className="contents" href="/">
					<div className="logo flex w-fit items-center justify-center gap-3 select-none hover:cursor-pointer">
						<div className="size-12">
							<Img
								className="logo-icon object-contain object-center"
								src={`${BASE_URL}/icon2.png`}
								width={48}
								height={48}
							/>
						</div>
						<div
							className={`logo-text flex flex-col gap-px ${georgia.className}`}
						>
							<span className={`text-lg/snug`}>
								{t("logoTop")}
							</span>
							<span className={`text-sm`}>{t("logoBottom")}</span>
						</div>
					</div>
				</a>
			</div>
		</header>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
