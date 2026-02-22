import { ResourcesSectionModel } from "@/src/lib/model/resources-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import ResourceWidget from "../../../../lib/component/resource-widget/ResourceWidget";
import { newReadonlyModel } from "@mvc-react/mvc";

const ResourcesSection = function ({ model }) {
	const { resources } = model.modelView;

	return (
		<section id="resources" className="resources bg-gray-900 text-white">
			<div className="h-3.75 w-full bg-[#250203] bg-[url(/ui/border-8.jpg)] bg-position-[50%_50%] bg-size-[25%] md:bg-size-[15%] lg:bg-size-[15%] bg-repeat-x" />
			<div className="resources-content flex flex-col gap-8 p-8 py-14 lg:p-20">
				<div className="flex flex-col gap-6 w-full justify-center items-center md:flex-row">
					{[
						...resources.map(resource => (
							<ResourceWidget
								key={resource.label}
								model={newReadonlyModel({
									resource,
								})}
							/>
						)),
					]}
				</div>
			</div>
			<div className="h-3.75 w-full bg-[#250203] bg-[url(/ui/border-8.jpg)] bg-position-[50%_50%] bg-size-[25%] md:bg-size-[15%] lg:bg-size-[15%] bg-repeat-x" />
		</section>
	);
} satisfies ModeledVoidComponent<ResourcesSectionModel>;

export default ResourcesSection;
