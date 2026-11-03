import { ModeledVoidComponent } from "@mvc-react/components";
import { ReadonlyModel } from "@mvc-react/mvc";
import { getTranslations } from "next-intl/server";
import { Language } from "../../../utilities/types";
import { georgia } from "../../../third-party/fonts";
import { Container, Img, Link, Text } from "react-email";
import { BASE_URL } from "@/src/lib/utilities/server-constants";

const EmailHeader = async function ({ model }) {
	const { language } = model.modelView;
	const t = await getTranslations({ namespace: "header", locale: language });

	return (
		<Container
			className={`email-header flex h-fit w-full max-w-full flex-col bg-gray-900`}
		>
			<Container className="header-content flex items-center justify-center p-4 text-white lg:p-6 lg:px-7">
				<Link className="contents" href="/">
					<Container className="logo flex w-fit items-center justify-center gap-3 select-none hover:cursor-pointer">
						<Container className="size-12">
							<Img
								className="logo-icon object-contain object-center"
								alt="Logo Icon"
								src={`${BASE_URL}/icon2.png`}
								width={48}
								height={48}
							/>
						</Container>
						<Container
							className={`logo-text flex flex-col gap-px ${georgia.className}`}
						>
							<Text className={`text-lg/snug`}>
								{t("logoTop")}
							</Text>
							<Text className={`text-sm`}>{t("logoBottom")}</Text>
						</Container>
					</Container>
				</Link>
			</Container>
		</Container>
	);
} satisfies ModeledVoidComponent<ReadonlyModel<{ language: Language }>>;

export default EmailHeader;
