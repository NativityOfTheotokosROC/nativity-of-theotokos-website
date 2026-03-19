import { ModeledContainerComponent } from "@mvc-react/components";
import React from "react";
import { ProtectedComponentModel } from "../../model/protected-component";
import { protect } from "../../server-action/auth";

const ProtectedComponent = async function ({
	model,
	children,
}: {
	model: ProtectedComponentModel;
	children: React.ReactNode;
}) {
	const { signInEndpoint, roles } = model.modelView;
	const test = await protect({ roles, signInEndpoint });
	console.log(test);

	return children;
} satisfies ModeledContainerComponent<ProtectedComponentModel>;

export default ProtectedComponent;
