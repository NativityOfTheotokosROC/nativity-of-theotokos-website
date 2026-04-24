import { Link } from "../page-loading-bar/PageLoadingBar";
import { ResourceWidgetModel } from "@/src/lib/models/resource-widget";
import { isRemotePath } from "@/src/lib/utilities/miscellaneous";
import { ModeledVoidComponent } from "@mvc-react/components";

const ResourceWidget = function ({ model }) {
	const { label, link, graphic } = model.modelView.resource;

	return (
		<Link
			href={link}
			target={isRemotePath(link) ? "_blank" : undefined}
			className="resource-widget contents"
		>
			<div className="flex h-[22em] w-full max-w-full items-stretch justify-stretch md:size-[22em]">
				<div
					style={{
						backgroundImage: `linear-gradient(to bottom, transparent, black), url(${graphic})`,
					}}
					className={`h-full w-full overflow-clip rounded-lg border border-black/70 bg-cover bg-center bg-no-repeat text-white transition duration-200 ease-out select-none hover:scale-[1.03] hover:text-[#dcb042] active:scale-[1.03] active:border-[#dcb042] active:text-[#dcb042]`}
				>
					<div className="flex size-full items-end justify-center p-6 text-center hover:cursor-pointer">
						<span className={`mb-3 text-3xl`}>{label}</span>
					</div>
				</div>
			</div>
		</Link>
	);
} satisfies ModeledVoidComponent<ResourceWidgetModel>;

export default ResourceWidget;
