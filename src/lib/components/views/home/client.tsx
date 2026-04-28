"use client";

import { useHome } from "@/src/lib/model-implementations/home";
import Home from "./Home";

export default function HomeClient() {
	const home = useHome();
	return <Home model={home} />;
}
