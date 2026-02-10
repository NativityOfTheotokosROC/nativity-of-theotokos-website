import { InputModelInteraction, InteractiveModel } from "@mvc-react/mvc";
import { Notification } from "../type/miscellaneous";

export interface NotifierModelView<N extends Notification<T>, T = unknown> {
	notification: N;
}

export type NotifierModelInteraction<
	N extends Notification<T>,
	T = unknown,
> = InputModelInteraction<"NOTIFY", { notification: N }>;

export type NotifierModel<
	N extends Notification<T>,
	T = unknown,
> = InteractiveModel<NotifierModelView<N>, NotifierModelInteraction<N>>;
