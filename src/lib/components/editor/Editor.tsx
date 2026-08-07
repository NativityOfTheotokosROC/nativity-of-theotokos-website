import "@/src/lib/styles/document.css";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { twMerge } from "tailwind-merge";
import { useEditorTools } from "../../model-implementations/editor-tools";
import { EditorModel } from "../../models/editor";
import EditorTools from "../editor-tools/EditorTools";

const Editor = function ({ model }) {
	const { modelView, interact } = model;
	const { content, className } = modelView;
	const editor = useEditor({
		content,
		extensions: [StarterKit, TextStyleKit, Superscript, Subscript],
		immediatelyRender: false,
		onUpdate({ editor }) {
			return interact({
				type: "UPDATE_EDITOR",
				input: { content: editor.getHTML() },
			});
		},
		editorProps: {
			transformPastedHTML(html) {
				return html.replace(/style="[^"]*"/gi, "");
			},
		},
	});
	const editorTools = useEditorTools(editor);

	return (
		<div
			className={twMerge(
				"flex w-full flex-col gap-4 rounded-lg border border-gray-400 bg-white p-6 md:p-8 md:px-[8em] lg:px-[13em]",
				className ?? "",
			)}
		>
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
				className="h-100 max-h-100 overflow-y-auto md:pr-4 md:text-lg/relaxed"
				editor={editor}
			/>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditorModel>>;

export default Editor;
