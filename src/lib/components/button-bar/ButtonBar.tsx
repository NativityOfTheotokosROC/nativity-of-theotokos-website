import { ModeledContainerComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { ButtonBarModel } from "../../models/button-bar";
import { twMerge } from "tailwind-merge";

const ButtonBar = function ({ model, children }) {
	// TODO: Do something with the cosmetics (className, style) mvc-react
	const { arrangement, orientation, className } = model.modelView;

	return (
		<div
			className={twMerge(
				`button-bar flex w-full flex-wrap items-center gap-3 ${orientation === "vertical" && "flex-col"} ${orientation === "horizontal" && "flex-row"} ${arrangement === "left" && "justify-left"} ${arrangement === "center" && "justify-center"} ${arrangement === "right" && "justify-right"} ${arrangement === "separated" && "justify-between"} ${arrangement === "spaced_around" && "justify-around"}`,
				className ?? "",
			)}
		>
			{children}
		</div>
	);
} satisfies ModeledContainerComponent<InitializedModel<ButtonBarModel>>;

export default ButtonBar;
