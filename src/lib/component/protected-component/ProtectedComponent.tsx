import { ModeledContainerComponent } from "@mvc-react/components";
import React from "react";
import { ProtectedComponentModel } from "../../model/protected-component";
import { protect } from "../../server-action/auth";
import { connection } from "next/server";

const ProtectedComponent = async function ({
	model,
	children,
}: {
	model: ProtectedComponentModel;
	children: React.ReactNode;
}) {
	const { signInEndpoint, roles } = model.modelView;
	await connection(); //HACK
	await protect({ roles, signInEndpoint });

	return children;
} satisfies ModeledContainerComponent<ProtectedComponentModel>;

export default ProtectedComponent;
