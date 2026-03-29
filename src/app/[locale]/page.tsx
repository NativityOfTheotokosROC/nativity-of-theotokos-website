// TODO: Refactor this file
"use client";

import { useHome } from "@/src/lib/model-implementation/home";
import Home from "@/src/lib/component/page/home/Home";

export default function Page() {
	const home = useHome();
	return <Home model={home} />;
}
