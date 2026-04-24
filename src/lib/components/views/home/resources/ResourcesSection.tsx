import { ResourcesSectionModel } from "@/src/lib/models/resources-section";
import { ModeledVoidComponent } from "@mvc-react/components";
import ResourceWidget from "../../../resource-widget/ResourceWidget";
import ResourcesBorder from "@/public/assets/border-8.webp";
import { newReadonlyModel } from "@mvc-react/mvc";

const ResourcesSection = function ({ model }) {
	const { resources } = model.modelView;

	return (
		<section id="resources" className="resources bg-gray-900 text-white">
			<div
				style={{ backgroundImage: `url(${ResourcesBorder.src})` }}
				className="h-3.75 w-full bg-[#250203] bg-size-[25%] bg-position-[50%_50%] bg-repeat-x md:bg-size-[15%] lg:bg-size-[15%]"
			/>
			<div className="resources-content flex flex-col gap-8 p-8 py-14 lg:p-20">
				<div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row">
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
			<div
				style={{ backgroundImage: `url(${ResourcesBorder.src})` }}
				className="h-3.75 w-full bg-[#250203] bg-size-[25%] bg-position-[50%_50%] bg-repeat-x md:bg-size-[15%] lg:bg-size-[15%]"
			/>
		</section>
	);
} satisfies ModeledVoidComponent<ResourcesSectionModel>;

export default ResourcesSection;
