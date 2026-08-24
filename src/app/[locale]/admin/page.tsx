import ProtectedComponent from "@/src/lib/components/protected-component/ProtectedComponent";
import { newReadonlyModel } from "@mvc-react/mvc";
import Admin from "../../../lib/components/views/admin/Admin";

export default async function Page() {
	return (
		<ProtectedComponent
			model={newReadonlyModel({
				roles: ["staff"],
			})}
		>
			<Admin />
		</ProtectedComponent>
	);
}
