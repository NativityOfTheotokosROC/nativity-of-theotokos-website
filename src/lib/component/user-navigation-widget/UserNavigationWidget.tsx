import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItem,
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
import { Fragment } from "react/jsx-runtime";
import {
	NavigationUser,
	UserNavigationWidgetModel,
	UserNavigationWidgetVariant,
} from "../../model/user-navigation-widget";
import UserAction from "../user-action/UserAction";

type WidgetVariantModel = ReadonlyModel<{
	user: NavigationUser;
	variant: UserNavigationWidgetVariant;
	greeting: string;
}>;
type DropdownButtonModel = ReadonlyModel<{ isDrawn: boolean }>;

const UserDisplay = function ({ model }) {
	const { variant, greeting, user } = model.modelView;
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
							alt={user.avatar.about ?? user.name}
							width={40}
							height={40}
							src={user.avatar.source}
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
							alt={user.avatar.about ?? user.name}
							width={40}
							height={40}
							src={user.avatar.source}
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
				className={`min-w-fit transition ease-out duration-200 ${isDrawn && "-rotate-180"}`}
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
		userDetails &&
		`${t("greeting")}, ${userDetails.user.name.split(" ")[0]}`;

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
													user: userDetails.user,
													variant,
													greeting: greeting!,
												})}
											/>
										</DropdownButtonContent>
									</DisclosureButton>
									<DisclosurePanel
										transition
										className="flex flex-col py-2 *:w-full *:px-6 md:*:px-8 *:py-4 *:text-left *:uppercase *:hover:text-[#dcb042] *:active:bg-gray-950 *:active:text-[#dcb042] origin-top duration-300 ease-out data-closed:opacity-0 data-closed:-translate-y-4 data-closed:h-1/2 border-t border-white/12 bg-gray-800"
									>
										{[
											...userDetails.userActions.map(
												userAction => (
													<UserAction
														key={
															userAction.modelView
																.name
														}
														model={userAction}
													/>
												),
											),
										]}
									</DisclosurePanel>
								</>
							)}
						</Disclosure>
					)}
					{style == "dropdown" && (
						<Menu>
							{({ open, close }) => (
								<>
									<MenuButton
										className={`dropdown-button w-full flex justify-between items-center text-left gap-3 outline-none`}
									>
										<DropdownButtonContent
											model={newReadonlyModel({
												isDrawn: open,
											})}
										>
											<UserDisplay
												model={newReadonlyModel({
													user: userDetails.user,
													variant,
													greeting: greeting!,
												})}
											/>
										</DropdownButtonContent>
									</MenuButton>
									<MenuItems
										anchor="bottom end"
										transition
										className="flex flex-col w-40 rounded-lg border bg-gray-800 border-white/15 focus:outline-none z-21 transition origin-top-right duration-200 ease-out [--anchor-gap:--spacing(1)] data-closed:scale-92 data-closed:opacity-0 *:w-full *:px-6 *:py-4 *:uppercase *:text-left *:hover:bg-gray-900/50 *:hover:text-[#dcb042] *:active:bg-gray-950 *:active:text-[#dcb042]"
									>
										{[
											...userDetails.userActions.map(
												userAction => (
													<MenuItem
														key={
															userAction.modelView
																.name
														}
														as={Fragment}
													>
														<UserAction
															model={{
																modelView: {
																	name: userAction
																		.modelView
																		.name,
																	action: async () => {
																		close();
																		userAction.modelView.action();
																	},
																},
															}}
														/>
													</MenuItem>
												),
											),
										]}
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
