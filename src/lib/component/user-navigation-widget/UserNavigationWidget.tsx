import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItems,
} from "@headlessui/react";
import {
	ModeledContainerComponent,
	ModeledVoidComponent,
} from "@mvc-react/components";
import {
	InitializedModel,
	newReadonlyModel,
	ReadonlyModel,
} from "@mvc-react/mvc";
import { ChevronDown as DropdownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
	NavigationUserDetails,
	UserNavigationWidgetModel,
	UserNavigationWidgetVariant,
} from "../../model/user-navigation-widget";
import { getUserActions } from "../../utility/user-actions";
import UserAction from "../user-action/UserAction";

type WidgetVariantModel = ReadonlyModel<{
	userDetails: NavigationUserDetails;
	variant: UserNavigationWidgetVariant;
	greeting: string;
}>;
type DropdownButtonModel = ReadonlyModel<{ isDrawn: boolean }>;

const UserDisplay = function ({ model }) {
	const { variant, greeting, userDetails } = model.modelView;
	switch (variant) {
		case "abbreviated": {
			return (
				<div
					className="user-pane w-full flex gap-3 items-center"
					title={greeting}
				>
					<div className="avatar-frame flex items-stretch justify-stretch size-10 min-w-10 rounded-lg overflow-clip border border-white/15">
						<Image
							className="grow object-center object-cover"
							alt={userDetails.avatar.about ?? userDetails.name}
							width={40}
							height={40}
							src={userDetails.avatar.source}
						/>
					</div>
				</div>
			);
		}
		case "no_avatar": {
			return (
				<div className="user-pane w-full flex gap-3 items-center">
					<span
						className={`greeting max-w-30 wrap-break-word hyphens-auto`}
					>
						{greeting}
					</span>
				</div>
			);
		}
		case "full": {
			return (
				<div className="user-pane w-full flex gap-3 items-center">
					<div className="avatar-frame flex items-stretch justify-stretch size-10 min-w-10 rounded-lg overflow-clip">
						<Image
							className="grow object-center object-cover"
							alt={userDetails.avatar.about ?? userDetails.name}
							width={40}
							height={40}
							src={userDetails.avatar.source}
						/>
					</div>

					<span
						className={`greeting max-w-30 wrap-break-word hyphens-auto`}
					>
						{greeting}
					</span>
				</div>
			);
		}
		default: {
			throw new Error(`Invalid variant: ${variant satisfies never}`);
		}
	}
} satisfies ModeledVoidComponent<WidgetVariantModel>;

const DropdownButtonContent = function ({ model, children }) {
	const { isDrawn } = model.modelView;

	return (
		<>
			{children}
			<DropdownIcon
				className={`min-w-fit ${isDrawn && "-rotate-180"}`}
				strokeWidth={1.75}
			/>
		</>
	);
} satisfies ModeledContainerComponent<DropdownButtonModel>;

const UserNavigationWidget = function ({ model }) {
	const {
		modelView: { userDetails, variant, style },
	} = model;

	const t = useTranslations("userNavigation");
	const greeting =
		userDetails && `${t("greeting")}, ${userDetails.name.split(" ")[0]}`;

	return userDetails ? (
		<div className="user-navigation">
			{userDetails && (
				<>
					{style == "accordion" && (
						<Disclosure>
							{({ open }) => (
								<>
									<DisclosureButton
										className={`dropdown-button w-full flex justify-between items-center text-left gap-3`}
									>
										<DropdownButtonContent
											model={newReadonlyModel({
												isDrawn: open,
											})}
										>
											<UserDisplay
												model={newReadonlyModel({
													userDetails,
													variant,
													greeting: greeting!,
												})}
											/>
										</DropdownButtonContent>
									</DisclosureButton>
									<DisclosurePanel className="flex flex-col py-2 *:w-full *:px-6 *:py-4 *:text-left *:uppercase origin-top duration-300 ease-out data-closed:opacity-0 data-closed:-translate-y-1/2 data-closed:h-1/2 border-t border-white/12">
										{[
											...getUserActions(
												userDetails.roles,
											),
										].map(action => (
											<UserAction
												key={action}
												model={newReadonlyModel({
													name: action,
												})}
											/>
										))}
									</DisclosurePanel>
								</>
							)}
						</Disclosure>
					)}
					{style == "dropdown" && (
						<Menu>
							{({ open }) => (
								<>
									<MenuButton
										className={`dropdown-button w-full flex justify-between items-center text-left gap-3`}
									>
										<DropdownButtonContent
											model={newReadonlyModel({
												isDrawn: open,
											})}
										>
											<UserDisplay
												model={newReadonlyModel({
													userDetails,
													variant,
													greeting: greeting!,
												})}
											/>
										</DropdownButtonContent>
									</MenuButton>
									<MenuItems className="flex flex-col w-40 *:w-full *:px-6 *:py-4 rounded-lg border border-white/15">
										{[
											...getUserActions(
												userDetails.roles,
											),
										].map(action => (
											<UserAction
												key={action}
												model={newReadonlyModel({
													name: action,
												})}
											/>
										))}
									</MenuItems>
								</>
							)}
						</Menu>
					)}
				</>
			)}
		</div>
	) : (
		<></>
	);
} satisfies ModeledVoidComponent<InitializedModel<UserNavigationWidgetModel>>;

export default UserNavigationWidget;
