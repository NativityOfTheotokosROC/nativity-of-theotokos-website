// TODO: Refactor this file
"use client";

import { useHome } from "@/src/lib/model-implementations/home";
import Home from "@/src/lib/components/views/home/Home";

export default function Page() {
	const home = useHome();
	return <Home model={home} />;
}
