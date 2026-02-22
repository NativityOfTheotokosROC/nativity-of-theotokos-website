"use client";

import { useHome } from "@/src/lib/model-implementation/home";
import Home from "./home/Home";

export default function Page() {
	const home = useHome();
	return <Home model={home} />;
}
