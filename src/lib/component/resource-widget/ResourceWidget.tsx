import { Link } from "../page-loading-bar/PageLoadingBar";
import { ResourceWidgetModel } from "@/src/lib/model/resource-widget";
import { isRemotePath } from "@/src/lib/utility/miscellaneous";
import { ModeledVoidComponent } from "@mvc-react/components";

const ResourceWidget = function ({ model }) {
	const { label, link, graphic } = model.modelView.resource;

	return (
		<Link
			href={link}
			target={isRemotePath(link) ? "_blank" : undefined}
			className="resource-widget contents"
		>
			<div className="flex items-stretch justify-stretch md:size-[22em] w-full max-w-full h-[22em]">
				<div
					style={{
						backgroundImage: `linear-gradient(to bottom, transparent, black), url(${graphic})`,
					}}
					className={`w-full h-full bg-cover bg-center bg-no-repeat rounded-lg overflow-clip border border-black/70 text-white hover:text-[#dcb042] hover:scale-[1.03] active:border-[#dcb042] active:text-[#dcb042] active:scale-[1.03] transition ease-out duration-200 select-none`}
				>
					<div className="flex size-full p-6 justify-center items-end text-center hover:cursor-pointer">
						<span className={`text-3xl mb-3`}>{label}</span>
					</div>
				</div>
			</div>
		</Link>
	);
} satisfies ModeledVoidComponent<ResourceWidgetModel>;

export default ResourceWidget;
