import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
	EditorToolsModel,
	EditorToolsModelInteraction,
} from "../models/editor-tools";
import { editorToolsStateSelector } from "../utilities/editor-tools";
import { useTranslations } from "next-intl";

export function useEditorTools(editor: Editor | null) {
	const editorState = useEditorState({
		editor,
		selector: ({ editor, transactionNumber }) => {
			if (editor)
				return editorToolsStateSelector({ editor, transactionNumber });
			return null;
		},
	});
	const t = useTranslations("editor");
	return {
		modelView: editorState
			? {
					bold: editorState.isBold,
					italic: editorState.isItalic,
					underline: editorState.isUnderlined,
					canUndo: editorState.canUndo,
					canRedo: editorState.canRedo,
					quote: editorState.isBlockquote,
					heading: editorState.isHeading1,
					bulletList: editorState.isBulletList,
					numberedList: editorState.isOrderedList,
				}
			: null,
		interact: async function (interaction: EditorToolsModelInteraction) {
			if (!editor) throw new Error(t("initError"));
			switch (interaction.type) {
				case "TOGGLE_HEADING": {
					editor.chain().focus().toggleHeading({ level: 1 }).run();
					break;
				}
				case "TOGGLE_BOLD": {
					editor.chain().focus().toggleBold().run();
					break;
				}
				case "TOGGLE_ITALIC": {
					editor.chain().focus().toggleItalic().run();
					break;
				}
				case "TOGGLE_UNDERLINE": {
					editor.chain().focus().toggleUnderline().run();
					break;
				}
				case "TOGGLE_BOLD": {
					editor.chain().focus().toggleBold().run();
					break;
				}
				case "TOGGLE_QUOTE": {
					editor.chain().focus().toggleBlockquote().run();
					break;
				}
				case "TOGGLE_BULLET_LIST": {
					editor.chain().focus().toggleBulletList().run();
					break;
				}
				case "TOGGLE_NUMBERED_LIST": {
					editor.chain().focus().toggleOrderedList().run();
					break;
				}
				case "UNDO": {
					editor.chain().focus().undo().run();
					break;
				}
				case "REDO": {
					editor.chain().focus().redo().run();
					break;
				}
				default: {
					interaction.type satisfies never;
				}
			}
		},
	} satisfies EditorToolsModel;
}
