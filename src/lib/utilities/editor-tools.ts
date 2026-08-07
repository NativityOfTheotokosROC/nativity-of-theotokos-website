import { EditorStateSnapshot, Editor } from "@tiptap/react";

export function editorToolsStateSelector(ctx: EditorStateSnapshot<Editor>) {
	return {
		isEditable: ctx.editor.isEditable,
		// Text formatting
		isBold: ctx.editor.isActive("bold") ?? false,
		canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
		isItalic: ctx.editor.isActive("italic") ?? false,
		canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
		isUnderlined: ctx.editor.isActive("underline") ?? false,
		isStrike: ctx.editor.isActive("strike") ?? false,
		canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
		canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
		isSuperscript: ctx.editor.isActive("superscript") ?? false,
		isSubscript: ctx.editor.isActive("subscript") ?? false,

		// Block types
		isParagraph: ctx.editor.isActive("paragraph") ?? false,
		isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,

		// Lists and blocks
		isBulletList: ctx.editor.isActive("bulletList") ?? false,
		isOrderedList: ctx.editor.isActive("orderedList") ?? false,
		isBlockquote: ctx.editor.isActive("blockquote") ?? false,

		// History
		canUndo: ctx.editor.can().chain().undo().run() ?? false,
		canRedo: ctx.editor.can().chain().redo().run() ?? false,
	};
}
