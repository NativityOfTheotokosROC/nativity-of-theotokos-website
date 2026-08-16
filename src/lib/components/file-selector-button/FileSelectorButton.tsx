import { ModeledContainerComponent } from "@mvc-react/components";
import { FileSelectorButtonModel } from "../../models/file-selector-button";
import { InitializedModel, newReadonlyModel } from "@mvc-react/mvc";
import { useRef } from "react";
import Button from "../button/Button";

const FileSelectorButton = function ({ model, children }) {
	const { modelView, interact } = model;
	const inputRef = useRef<HTMLInputElement>(null);
	const type = modelView?.type;
	const acceptedFileType =
		type && type === "image"
			? "image/*"
			: type === "audio"
				? "audio/*"
				: type === "video"
					? "video/*"
					: undefined;

	return (
		<>
			<input
				type="file"
				className="hidden"
				accept={acceptedFileType}
				onChange={async e => {
					const file = e.target.files ? e.target.files[0] : null;
					if (file)
						await interact({
							type: "SELECT_FILE",
							input: { file },
						});
				}}
				ref={inputRef}
			/>
			<Button
				model={newReadonlyModel({
					type: "button",
					className:
						"w-fit flex items-center justify-center max-w-1/2 min-w-[8em]",
					action() {
						inputRef.current?.click();
					},
				})}
			>
				{children}
			</Button>
		</>
	);
} satisfies ModeledContainerComponent<FileSelectorButtonModel>;

export default FileSelectorButton;
