import ProtectedComponent from "@/src/lib/component/protected-component/ProtectedComponent";
import { newReadonlyModel } from "@mvc-react/mvc";
import Admin from "./Admin";
import { connection } from "next/server";

export default async function Page() {
	await connection(); //HACK
	return (
		<ProtectedComponent
			model={newReadonlyModel({
				roles: ["staff"],
				signInEndpoint: "/admin",
			})}
		>
			<Admin />
		</ProtectedComponent>
	);
}
