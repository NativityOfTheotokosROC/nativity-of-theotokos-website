import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import { editorToolsStateSelector } from "../utilities/editor-tools";
import {
	EditorToolsModel,
	EditorToolsModelInteraction,
} from "../models/editor-tools";
import { InitializedModel } from "@mvc-react/mvc";

export function useEditorTools(editor: Editor) {
	const editorState = useEditorState({
		editor,
		selector: editorToolsStateSelector,
	});
	const {
		isBold,
		isItalic,
		isUnderlined,
		canUndo,
		canRedo,
		isBlockquote,
		isHeading1,
		isBulletList,
		isOrderedList,
	} = editorState;
	return {
		modelView: {
			bold: isBold,
			italic: isItalic,
			underline: isUnderlined,
			canUndo,
			canRedo,
			quote: isBlockquote,
			heading: isHeading1,
			bulletList: isBulletList,
			numberedList: isOrderedList,
		},
		interact: function (
			interaction: EditorToolsModelInteraction,
		): void | Promise<void> {
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
	} satisfies InitializedModel<EditorToolsModel>;
}
