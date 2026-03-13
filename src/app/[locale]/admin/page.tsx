import { protect } from "@/src/lib/server-action/auth";
import { redirect } from "next/navigation";

export default async function Page() {
	await protect({ roles: ["staff"], signInEndpoint: "/admin" });
	redirect("/");
}
