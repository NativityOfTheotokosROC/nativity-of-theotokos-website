import { ModeledVoidComponent } from "@mvc-react/components";
import { ChevronDown as DropdownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { UserNavigationWidgetModel } from "../../model/user-navigation-widget";
import { InitializedModel } from "@mvc-react/mvc";

const UserNavigationWidget = function ({ model }) {
	const {
		modelView: { userDetails, type },
	} = model;

	const t = useTranslations("userNavigation");
	const greeting =
		userDetails && `${t("greeting")}, ${userDetails.name.split(" ")[0]}`;

	return userDetails ? (
		<div className="user-navigation">
			<div
				className={`user-navigation-content ${type == "sidebar" && "bg-gray-800"} flex flex-col`}
			>
				<button
					className={`user-button flex justify-between items-center text-left gap-3 ${type == "sidebar" && "px-4 py-4"} text-white`}
					title={type == "navbar" && greeting ? greeting : undefined}
				>
					<div className="user-pane w-full flex gap-3 items-center">
						<div className="avatar-frame flex items-stretch justify-stretch size-10 min-w-10 rounded-sm overflow-clip border border-white/15">
							<Image
								className="grow object-center object-cover"
								alt={
									userDetails.avatar.about ?? userDetails.name
								}
								width={40}
								height={40}
								src={userDetails.avatar.source}
							/>
						</div>
						{type == "sidebar" && (
							<span
								className={`greeting max-w-30 wrap-break-word hyphens-auto`}
							>
								{greeting}
							</span>
						)}
					</div>
					<DropdownIcon className="min-w-fit" strokeWidth={1.75} />
				</button>
			</div>
		</div>
	) : (
		<></>
	);
} satisfies ModeledVoidComponent<InitializedModel<UserNavigationWidgetModel>>;

export default UserNavigationWidget;
