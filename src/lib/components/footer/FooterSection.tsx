import { ModeledContainerComponent } from "@mvc-react/components";
import { FooterSectionModel } from "../../models/footer-section";

const FooterSection = function ({ model, children }) {
	const { title } = model.modelView;
	return (
		<div className="footer-section flex max-w-[25em] flex-col gap-3">
			<span className="text-base uppercase">{title}</span>
			<div className="text-sm">{children}</div>
		</div>
	);
} as ModeledContainerComponent<FooterSectionModel>;

export default FooterSection;
