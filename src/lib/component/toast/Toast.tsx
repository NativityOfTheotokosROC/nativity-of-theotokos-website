import { ModeledVoidComponent } from "@mvc-react/components";
import { ToastModel } from "../../model/toast";

const Toast = function ({ model }) {
	const { notification } = model.modelView;

	return (
		<div
			className={`toast flex max-w-full p-6 justify-center items-center text-center bg-[#FEF8F3]/99 text-black border-3 border-gray-600 rounded-lg overflow-clip`}
		>
			<span className="text-sm line-clamp-3">{notification.message}</span>
		</div>
	);
} satisfies ModeledVoidComponent<ToastModel>;

export default Toast;
