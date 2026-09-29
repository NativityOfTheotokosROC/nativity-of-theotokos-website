import "@/src/lib/styles/document.css";
import OfficePaste from "@intevation/tiptap-extension-office-paste";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useEditorTools } from "../../model-implementations/editor-tools";
import { EditorModel } from "../../models/editor";
import EditorTools from "../editor-tools/EditorTools";

const Editor = function ({ model }) {
	const { modelView } = model;
	const { initialContent, changeCallback, className, isReadonly, locale } =
		modelView;
	const editor = useEditor({
		editable: !isReadonly,
		content: initialContent,
		extensions: [
			StarterKit,
			TextStyleKit,
			Superscript,
			Subscript,
			OfficePaste,
		],
		immediatelyRender: false,
		onUpdate({ editor }) {
			changeCallback?.(editor.getHTML());
		},
		editorProps: {
			transformPastedHTML(html) {
				return html.replace(/style="[^"]*"/gi, "");
			},
		},
	});
	const editorTools = useEditorTools(editor);

	useEffect(() => {
		if (isReadonly !== undefined) editor?.setEditable(!isReadonly);
	}, [isReadonly, editor]);

	return (
		<div
			className={twMerge(
				"@container w-full rounded-lg border border-gray-400 bg-white",
				className,
			)}
		>
			<div className="flex w-full flex-col gap-4 p-6 @3xl:p-8 @3xl:px-[8em] @5xl:px-[13em]">
				{editorTools.modelView ? (
					<>
						<EditorTools
							model={{
								...editorTools,
								modelView: editorTools.modelView,
							}}
						/>
						<hr className="text-black/50" />
					</>
				) : (
					<></>
				)}
				<EditorContent
					className="h-100 max-h-100 overflow-y-auto @xl:pr-4 @xl:text-lg/relaxed"
					editor={editor}
					lang={locale} // TODO: Address this in the future
				/>
			</div>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditorModel>>;

export default Editor;
