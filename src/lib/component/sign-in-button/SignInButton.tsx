import { YandexIcon } from "@/src/lib/component/miscellaneous/graphic";
import { SignInButtonModel } from "@/src/lib/model/sign-in-button";
import { SiGoogle as Google } from "@icons-pack/react-simple-icons";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useTranslations } from "next-intl";
import Spinner from "../spinner/Spinner";

const SignInButton = function ({ model }) {
	const { modelView, interact } = model;
	const { signInService, isEnabled, isSelected } = modelView;
	const t = useTranslations("signInButton");

	switch (signInService) {
		case "google": {
			return (
				<button
					className="flex items-center gap-3 p-3 border border-gray-400 bg-gray-800 text-white rounded-lg overflow-clip hover:bg-gray-900 active:bg-gray-950 disabled:opacity-60"
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
						<Google className="size-6 fill-[#4285F4]" />
					)}

					{t("buttonText", { serviceName: "Google" })}
				</button>
			);
		}
		case "yandex": {
			return (
				<button
					className="flex items-center gap-3 p-3 border border-gray-400 bg-gray-800 text-white rounded-lg overflow-clip hover:bg-gray-900 active:bg-gray-950 disabled:opacity-60"
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
						<YandexIcon className="size-6" />
					)}
					{t("buttonText", { serviceName: "Yandex" })}
				</button>
			);
		}
	}
} satisfies ModeledVoidComponent<InitializedModel<SignInButtonModel>>;

export default SignInButton;
