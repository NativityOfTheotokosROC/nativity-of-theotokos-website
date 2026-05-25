import MicrosoftIcon from "@/public/assets/microsoft-icon.svg";
import YandexIcon from "@/public/assets/yandex-icon.svg";
import { SignInButtonModel } from "@/src/lib/models/sign-in-button";
import { SiGoogle as GoogleIcon } from "@icons-pack/react-simple-icons";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import { JSX } from "react";
import Spinner from "../spinner/Spinner";

const SignInButton = function ({ model }) {
	const { modelView, interact } = model;
	const { signInService, isEnabled, isSelected } = modelView;
	const t = useTranslations("signInButton");
	let Icon: JSX.Element;
	let serviceName;

	switch (signInService) {
		case "google": {
			Icon = <GoogleIcon className="size-6 fill-[#4285F4]" />;
			serviceName = "Google";
			break;
		}
		case "yandex": {
			Icon = <YandexIcon className="size-6" />;
			serviceName = "Yandex";
			break;
		}
		case "microsoft": {
			Icon = <MicrosoftIcon className="size-6" />;
			serviceName = "Microsoft";
			break;
		}
	}
	return (
		<button
			className="flex items-center gap-3 overflow-clip rounded-lg border border-gray-400 bg-gray-800 p-3 text-white hover:bg-gray-900 active:bg-gray-950 disabled:opacity-60"
			disabled={!isEnabled}
			onClick={() => interact({ type: "SIGN_IN" })}
		>
			{isSelected ? (
				<Spinner
					model={newReadonlyModel({
						color: "white",
						size: 24,
					})}
				/>
			) : (
				Icon
			)}
			{t("buttonText", { serviceName })}
		</button>
	);
} satisfies ModeledVoidComponent<InitializedModel<SignInButtonModel>>;

export default SignInButton;
