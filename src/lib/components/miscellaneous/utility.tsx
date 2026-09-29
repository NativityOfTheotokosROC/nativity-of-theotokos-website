import { newReadonlyModel } from "@mvc-react/mvc";
import toast from "react-hot-toast";
import { ToastNotification } from "../../models/toast";
import Toast from "../toast/Toast";
import { connection } from "next/server";
import { Suspense } from "react";
import { Transition } from "@headlessui/react";

export function createToast(notification: ToastNotification) {
	return toast.custom(t => (
		<Transition
			appear
			show={t.visible}
			enter="transition duration-300 ease-out"
			enterFrom={`opacity-0 scale-92`}
			enterTo="opacity-100 scale-100"
			leave="transition duration-300 ease-out"
			leaveFrom="opacity-100 scale-100"
			leaveTo={`opacity-0 scale-92`}
		>
			<Toast model={newReadonlyModel({ notification })} />
		</Transition>
	));
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
