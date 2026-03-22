import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { ChevronDown as DropdownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { UserNavigationModel } from "../../model/user-navigation";

const UserNavigation = function ({ model }) {
	const {
		modelView: { userDetails },
	} = model;
	const {
		avatar: { source, about },
		name,
	} = userDetails;

	const t = useTranslations("userNavigation");

	return (
		<div className="user-navigation">
			<div className="user-navigation-content bg-gray-800 flex flex-col">
				<button className="user-button flex justify-between items-center text-left gap-3 px-4 py-4 text-white">
					<div className="user-pane w-full flex gap-3 items-center">
						<div className="avatar-frame flex items-stretch justify-stretch size-10 min-w-10 rounded-full overflow-clip border-2 border-white/15">
							<Image
								className="grow object-center object-cover"
								alt={about ?? name}
								width={20}
								height={20}
								src={source}
							/>
						</div>
						<span
							className={`greeting max-w-30 wrap-break-word hyphens-auto`}
						>{`${t("greeting")}, ${name.split(" ")[0]}`}</span>
					</div>
					<DropdownIcon className="min-w-fit" strokeWidth={1.75} />
				</button>
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<UserNavigationModel>>;

export default UserNavigation;
