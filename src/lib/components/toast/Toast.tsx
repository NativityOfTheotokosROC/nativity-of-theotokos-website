import { ModeledVoidComponent } from "@mvc-react/components";
import { ToastModel } from "../../models/toast";

const Toast = function ({ model }) {
	const { notification } = model.modelView;

	return (
		<div
			className={`toast flex max-w-full items-center justify-center overflow-clip rounded-lg border border-gray-400 bg-gray-800/99 p-6 text-center text-white`}
		>
			<span className="line-clamp-3 text-sm">{notification.message}</span>
		</div>
	);
} satisfies ModeledVoidComponent<ToastModel>;

export default Toast;
