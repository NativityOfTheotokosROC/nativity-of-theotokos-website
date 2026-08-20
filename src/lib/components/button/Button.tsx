"use client";

import { ModeledContainerComponent } from "@mvc-react/components";
import { ButtonModel } from "../../models/button";
import { twMerge } from "tailwind-merge";

const Button = function ({ model, children }) {
	const { action, disabled, className, type, variant, title } =
		model.modelView;
	const computedVariant = variant ?? "standard";

	return (
		<button
			title={title}
			type={type ?? "button"}
			className={twMerge(
				`flex w-fit max-w-full items-center justify-center rounded-lg p-4 wrap-break-word hyphens-auto disabled:opacity-50 ${computedVariant === "standard" ? "bg-[#250203]/82 text-white hover:bg-[#250203]/92 active:bg-[#250203]" : computedVariant === "alternative" ? "border border-[#250203]/62 bg-transparent text-[#250203]/82 hover:bg-[#250203]/52 hover:text-white active:bg-[#250203] active:text-white" : ""}`,
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
