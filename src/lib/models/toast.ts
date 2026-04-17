import { ReadonlyModel } from "@mvc-react/mvc";
import { Notification } from "../types/general";

export type ToastNotification = { message: string } & Notification<
	"info" | "success" | "failure"
>;

export interface ToastModelView {
	notification: ToastNotification;
}

// export type ToastModelInteraction = ModelInteraction<"DISMISS">;

export type ToastModel = ReadonlyModel<ToastModelView>;
