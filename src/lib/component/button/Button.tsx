"use client";

import { ModeledContainerComponent } from "@mvc-react/components";
import { ButtonModel } from "../../model/button";
import { twMerge } from "tailwind-merge";

const Button = function ({ model, children }) {
	const { action, disabled, className } = model.modelView;

	return (
		<button
			className={twMerge(
				"w-30 rounded-lg bg-[#250203]/82 p-4 text-white hover:bg-[#250203]/92 active:bg-[#250203]",
				className ?? "",
			)}
			onClick={action}
			disabled={disabled}
		>
			{children}
		</button>
	);
} satisfies ModeledContainerComponent<ButtonModel>;

export default Button;
