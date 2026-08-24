"use client";

import ViewLoadingSkeleton from "@/src/lib/components/view-loading-skeleton/ViewLoadingSkeleton";
import { useLayoutEffect } from "react";

export default function Admin() {
	useLayoutEffect(() => {
		window.location.replace("/");
	}, []);
	return <ViewLoadingSkeleton />;
}
