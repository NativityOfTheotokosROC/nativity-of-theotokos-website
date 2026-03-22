import { ModeledVoidComponent } from "@mvc-react/components";
import { ChevronDown as DropdownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { UserNavigationWidgetModel } from "../../model/user-navigation-widget";

const UserNavigationWidget = function ({ model }) {
	const { modelView } = model;

	const t = useTranslations("userNavigation");

	return modelView?.userDetails ? (
		<div className="user-navigation">
			<div className="user-navigation-content bg-gray-800 flex flex-col">
				<button className="user-button flex justify-between items-center text-left gap-3 px-4 py-4 text-white">
					<div className="user-pane w-full flex gap-3 items-center">
						<div className="avatar-frame flex items-stretch justify-stretch size-10 min-w-10 rounded-sm overflow-clip border-2 border-white/15">
							<Image
								className="grow object-center object-cover"
								alt={
									modelView.userDetails.avatar.about ??
									modelView.userDetails.name
								}
								width={20}
								height={20}
								src={modelView.userDetails.avatar.source}
							/>
						</div>
						<span
							className={`greeting max-w-30 wrap-break-word hyphens-auto`}
						>{`${t("greeting")}, ${modelView.userDetails.name.split(" ")[0]}`}</span>
					</div>
					<DropdownIcon className="min-w-fit" strokeWidth={1.75} />
				</button>
			</div>
		</div>
	) : (
		<></>
	);
} satisfies ModeledVoidComponent<UserNavigationWidgetModel>;

export default UserNavigationWidget;
