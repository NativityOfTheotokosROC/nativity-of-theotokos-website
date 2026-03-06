import { ModeledVoidComponent } from "@mvc-react/components";
import { ToastModel } from "../../model/toast";

const Toast = function ({ model }) {
	const { notification } = model.modelView;

	return (
		<div
			className={`toast flex max-w-full p-6 justify-center items-center text-center bg-gray-800/99 text-white border border-gray-400 rounded-lg overflow-clip`}
		>
			<span className="text-sm line-clamp-3">{notification.message}</span>
		</div>
	);
} satisfies ModeledVoidComponent<ToastModel>;

export default Toast;
