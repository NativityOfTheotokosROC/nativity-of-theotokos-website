import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import LogoIcon from "@/public/assets/logo-icon.svg";
import Link from "next/link";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<header
			className={`email-header flex h-fit w-full max-w-full flex-col bg-gray-900`}
		>
			<div className="header-content flex items-center justify-center p-4 text-white lg:p-6 lg:px-7">
				<Link className="contents" href="/">
					<div className="logo flex w-fit items-center justify-center gap-3 select-none hover:cursor-pointer">
						<div className="size-12">
							<LogoIcon
								className="logo-icon object-contain object-center"
								width={48}
								height={48}
								strokeWidth={9}
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
				</Link>
			</div>
		</header>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
