import { ReadonlyModel } from "@mvc-react/mvc";
import { MessageNotification } from "../types/general";

export type ToastNotification = MessageNotification<
	"info" | "success" | "failure"
>;

export type ToastModelView = {
	notification: ToastNotification;
};

export type ToastModel = ReadonlyModel<ToastModelView>;
