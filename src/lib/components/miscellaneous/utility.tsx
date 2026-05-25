import { newReadonlyModel } from "@mvc-react/mvc";
import toast from "react-hot-toast";
import { ToastNotification } from "../../models/toast";
import Toast from "../toast/Toast";
import { connection } from "next/server";
import { Suspense } from "react";

export function createToast(notification: ToastNotification) {
	return toast.custom(<Toast model={newReadonlyModel({ notification })} />);
}
const Connection = async () => {
	await connection();
	return null;
};
export async function DynamicMarker() {
	return (
		<Suspense>
			<Connection />
		</Suspense>
	);
}
