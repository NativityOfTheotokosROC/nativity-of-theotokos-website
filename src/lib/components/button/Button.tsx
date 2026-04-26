"use client";

import { ModeledContainerComponent } from "@mvc-react/components";
import { ButtonModel } from "../../models/button";
import { twMerge } from "tailwind-merge";

const Button = function ({ model, children }) {
	const { action, disabled, className, type } = model.modelView;

	return (
		<button
			type={type}
			className={twMerge(
				"w-30 rounded-lg bg-[#250203]/82 p-4 text-white hover:bg-[#250203]/92 active:bg-[#250203] disabled:cursor-default disabled:bg-[#250203]/50",
				className ?? "",
			)}
			onClick={() => action?.()}
			disabled={disabled}
		>
			{children}
		</button>
	);
} satisfies ModeledContainerComponent<ButtonModel>;

export default Button;
