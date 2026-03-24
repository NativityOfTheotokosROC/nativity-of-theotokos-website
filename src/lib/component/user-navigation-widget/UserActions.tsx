import { ModeledVoidComponent } from "@mvc-react/components";
import { UserActionsModel } from "../../model/user-actions";
import UserAction from "../user-action/UserAction";
import { newReadonlyModel } from "@mvc-react/mvc";

const UserActions = function ({ model }) {
	const { actions } = model.modelView;

	return (
		<div className="flex flex-col *:w-full *:px-6 *:py-4">
			{[...actions].map(action => (
				<UserAction
					key={action}
					model={newReadonlyModel({ name: action })}
				/>
			))}
		</div>
	);
} satisfies ModeledVoidComponent<UserActionsModel>;

export default UserActions;
