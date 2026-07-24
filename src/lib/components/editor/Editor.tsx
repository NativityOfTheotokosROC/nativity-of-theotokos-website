import { ModeledVoidComponent } from "@mvc-react/components";
import { EditorModel } from "../../models/editor";
import { InitializedModel } from "@mvc-react/mvc";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import EditorTools from "../editor-tools/EditorTools";
import { useEditorTools } from "../../model-implementations/editor-tools";
import "./article-editor.css";

const Editor = function ({ model }) {
	const { initialContent } = model.modelView;
	const editor = useEditor({
		content: initialContent,
		extensions: [StarterKit, TextStyleKit],
		immediatelyRender: false,
	});
	const editorTools = useEditorTools(editor);

	return (
		<div className="flex w-full flex-col gap-4 rounded-lg border border-black/50 bg-white p-6 md:p-8">
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
				className="h-100 max-h-100 overflow-y-auto"
				editor={editor}
			/>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditorModel>>;

export default Editor;
