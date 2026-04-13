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
import { Suspense, useContext } from "react";
import { Fragment } from "react/jsx-runtime";
import {
	NavigationUser,
	UserNavigationWidgetModel,
	UserNavigationWidgetVariant,
} from "../../model/user-navigation-widget";
import { UserInformationContext } from "../../utility/user";
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
					className="user-pane flex w-full items-center gap-3"
					title={greeting}
				>
					<div className="avatar-frame flex size-10 min-w-10 items-stretch justify-stretch overflow-clip rounded-lg border border-white/15">
						<Image
							className="grow object-cover object-center"
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
				<div className="user-pane flex w-full items-center gap-3">
					<span
						className={`greeting max-w-40 wrap-break-word hyphens-auto`}
					>
						{greeting}
					</span>
				</div>
			);
		}
		case "full": {
			return (
				<div className="user-pane flex w-full items-center gap-3">
					<div className="avatar-frame flex size-10 min-w-10 items-stretch justify-stretch overflow-clip rounded-lg border border-white/15">
						<Image
							className="grow object-cover object-center"
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
				className={`min-w-fit transition duration-200 ease-out ${isDrawn && "-rotate-180"}`}
				strokeWidth={1.75}
			/>
		</>
	);
} satisfies ModeledContainerComponent<DropdownButtonModel>;

const UserNavigationWidget = function ({ model }) {
	const { variant } = model.modelView;
	return (
		// HACK: Hacky
		<Suspense
			fallback={
				<UserNavigationWidgetSkeleton
					model={newReadonlyModel({ variant })}
				/>
			}
		>
			<UserNavigationWidgetCore model={model} />
		</Suspense>
	);
} satisfies ModeledVoidComponent<InitializedModel<UserNavigationWidgetModel>>;

export const UserNavigationWidgetSkeleton = function ({ model }) {
	const { variant } = model.modelView;

	switch (variant) {
		case "no_avatar":
			return <div className={`h-10 w-full max-w-40`} />;
		case "abbreviated":
			return (
				<div className="flex w-fit animate-pulse items-center gap-3 *:bg-white/20">
					<div className="size-10 overflow-clip rounded-lg" />
				</div>
			);
		case "full":
			return (
				<div className="dropdown-button flex w-full animate-pulse items-center gap-3 overflow-clip rounded-lg *:h-10 *:bg-white/20">
					<div className="size-10 min-w-10 overflow-clip rounded-lg" />
					<div className={`h-full w-full max-w-40`} />
				</div>
			);
	}
} satisfies ModeledVoidComponent<
	ReadonlyModel<{ variant: UserNavigationWidgetVariant }>
>;

export const UserNavigationWidgetCore = function ({ model }) {
	const {
		modelView: { variant, style, getUserActions },
	} = model;

	const t = useTranslations("userNavigation");
	const userInformation = useContext(UserInformationContext);
	const userActions =
		userInformation != null && userInformation != "pending"
			? getUserActions(userInformation.roles)
			: null;
	const userDetails =
		userInformation && userInformation != "pending"
			? {
					user: {
						name: userInformation.name,
						avatar: userInformation.avatar,
					},
					userActions: userActions!,
				}
			: null;

	const greeting =
		userDetails &&
		`${t("greeting")}, ${userDetails.user.name.split(" ")[0]}`;

	return userDetails ? (
		<div className="user-navigation">
			<>
				{style == "accordion" && (
					<Disclosure>
						{({ open }) => (
							<>
								<DisclosureButton
									className={`dropdown-button flex w-full items-center justify-between gap-3 text-left`}
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
									className="flex origin-top flex-col border-t border-white/12 bg-gray-800 py-2 duration-300 ease-out *:w-full *:px-6 *:py-4 *:text-left *:uppercase *:hover:text-[#dcb042] *:active:bg-gray-950 *:active:text-[#dcb042] data-closed:h-1/2 data-closed:-translate-y-4 data-closed:opacity-0 md:*:px-8"
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
									className={`dropdown-button flex w-full items-center justify-between gap-3 text-left outline-none`}
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
									className="z-21 flex w-40 origin-top-right flex-col rounded-lg border border-white/15 bg-gray-800 transition duration-200 ease-out [--anchor-gap:--spacing(1)] *:w-full *:px-6 *:py-4 *:text-left *:uppercase *:hover:bg-gray-900/50 *:hover:text-[#dcb042] focus:outline-none *:active:bg-gray-950 *:active:text-[#dcb042] data-closed:scale-92 data-closed:opacity-0"
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
		</div>
	) : userInformation == "pending" ? (
		<UserNavigationWidgetSkeleton model={newReadonlyModel({ variant })} />
	) : (
		<></>
	);
} satisfies ModeledVoidComponent<InitializedModel<UserNavigationWidgetModel>>;

export default UserNavigationWidget;
