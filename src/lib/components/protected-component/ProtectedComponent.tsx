import { ModeledContainerComponent } from "@mvc-react/components";
import React from "react";
import { ProtectedComponentModel } from "../../models/protected-component";
import { protect } from "../../server-actions/auth";

const ProtectedComponent = async function ({
	model,
	children,
}: {
	model: ProtectedComponentModel;
	children: React.ReactNode;
}) {
	const { roles } = model.modelView;
	await protect({ roles });

	return children;
} satisfies ModeledContainerComponent<ProtectedComponentModel>;

export default ProtectedComponent;
