"use client";

import dynamic from "next/dynamic";

export const HeaderDynamic = dynamic(
	() => import("@/src/lib/components/header/Header"),
	{ ssr: false },
);
