"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { ArticleEditorModel } from "../../models/article-editor";
import { InitializedModel } from "@mvc-react/mvc";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import EditorTools from "../editor-tools/EditorTools";
import { useEditorTools } from "../../model-implementations/editor-tools";

const ArticleEditor = function ({ model }) {
	const { initialContent } = model.modelView;
	const editor = useEditor({
		content: initialContent,
		extensions: [StarterKit, TextStyleKit],
		immediatelyRender: false,
	});
	const editorTools = useEditorTools(editor);
	console.log(editor);

	return (
		<div className="flex w-full flex-col">
			{editorTools.modelView ? (
				<>
					<EditorTools
						model={{
							...editorTools,
							modelView: editorTools.modelView,
						}}
					/>
					<EditorContent editor={editor} />
				</>
			) : (
				<></>
			)}
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<ArticleEditorModel>>;

export default ArticleEditor;
