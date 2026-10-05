import { ModeledComponent } from "@mvc-react/components";
import React from "react";
import { ProtectedComponentModel } from "../../models/protected-component";
import { protect } from "../../server-actions/auth";

const ProtectedComponent = async function ({ model, children }) {
	const { roles } = model.modelView;
	await protect({ roles });

	return <>{children}</>;
} satisfies ModeledComponent<ProtectedComponentModel>;

export default ProtectedComponent;
