import { ModeledContainerComponent } from "@mvc-react/components";
import { FooterSectionModel } from "../../model/footer-section";

const FooterSection = function ({ model, children }) {
	const { title } = model.modelView;
	return (
		<div className="footer-section flex flex-col gap-3 max-w-[25em]">
			<span className="uppercase text-base">{title}</span>
			<div className="text-sm">{children}</div>
		</div>
	);
} as ModeledContainerComponent<FooterSectionModel>;

export default FooterSection;
