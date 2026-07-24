"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import {
	BoldIcon,
	HeadingIcon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	QuoteIcon,
	Redo2Icon,
	UnderlineIcon,
	Undo2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorToolsModel } from "../../models/editor-tools";
import EditorButton from "../editor-button/EditorButton";

const EditorTools = function ({ model }) {
	const { modelView, interact } = model;
	const {
		heading,
		bold,
		italic,
		underline,
		quote,
		bulletList,
		numberedList,
		canUndo,
		canRedo,
	} = modelView;
	const t = useTranslations("editorTools");

	return (
		<div className="flex w-full flex-wrap items-center justify-center gap-2">
			<EditorButton
				model={{
					modelView: { title: t("heading"), isToggled: heading },
					interact: () => interact({ type: "TOGGLE_HEADING" }),
				}}
			>
				<HeadingIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: { title: t("bold"), isToggled: bold },
					interact: () => interact({ type: "TOGGLE_BOLD" }),
				}}
			>
				<BoldIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: { title: t("italic"), isToggled: italic },
					interact: () => interact({ type: "TOGGLE_ITALIC" }),
				}}
			>
				<ItalicIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: { title: t("underline"), isToggled: underline },
					interact: () => interact({ type: "TOGGLE_UNDERLINE" }),
				}}
			>
				<UnderlineIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: { title: t("quote"), isToggled: quote },
					interact: () => interact({ type: "TOGGLE_QUOTE" }),
				}}
			>
				<QuoteIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: {
						title: t("bulletList"),
						isToggled: bulletList,
					},
					interact: () => interact({ type: "TOGGLE_BULLET_LIST" }),
				}}
			>
				<ListIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: {
						title: t("numberedList"),
						isToggled: numberedList,
					},
					interact: () => interact({ type: "TOGGLE_NUMBERED_LIST" }),
				}}
			>
				<ListOrderedIcon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: {
						title: t("undo"),
						isDisabled: !canUndo,
					},
					interact: () => interact({ type: "UNDO" }),
				}}
			>
				<Undo2Icon />
			</EditorButton>
			<EditorButton
				model={{
					modelView: {
						title: t("redo"),
						isDisabled: !canRedo,
					},
					interact: () => interact({ type: "REDO" }),
				}}
			>
				<Redo2Icon />
			</EditorButton>
		</div>
	);
} satisfies ModeledVoidComponent<InitializedModel<EditorToolsModel>>;

export default EditorTools;
