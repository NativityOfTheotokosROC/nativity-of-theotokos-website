import { ModeledVoidComponent } from "@mvc-react/components";
import { LoginTooltipModel } from "../../models/login-tooltip";
import { Tooltip } from "react-tooltip";

const LoginTooltip = function ({ model }) {
	const { isOpen, text, id } = model.modelView;

	return (
		<Tooltip
			id={id}
			key={id}
			className="login-tooltip"
			isOpen={isOpen}
			content={text}
			border="1px solid #ffdc4f"
			place="bottom-end"
		/>
	);
} satisfies ModeledVoidComponent<LoginTooltipModel>;

export default LoginTooltip;
