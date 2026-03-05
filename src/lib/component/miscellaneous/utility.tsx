import { newReadonlyModel } from "@mvc-react/mvc";
import toast from "react-hot-toast";
import { ToastNotification } from "../../model/toast";
import Toast from "../toast/Toast";

export function createToast(notification: ToastNotification) {
	return toast.custom(<Toast model={newReadonlyModel({ notification })} />);
}
