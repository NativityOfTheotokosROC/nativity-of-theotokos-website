import { ReactNode } from "react";

export default function EditorButtonGroup({
	children,
}: {
	children: ReactNode;
}) {
	return <div className="flex gap-1">{children}</div>;
}
