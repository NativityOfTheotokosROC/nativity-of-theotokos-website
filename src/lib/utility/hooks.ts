"use client";
import { getBaseURL } from "../server-action/miscellaneous";

const useOrigin = function (): Promise<string> {
	if (typeof window == "undefined") return getBaseURL();
	return Promise.resolve(window.location.origin);
};

export { useOrigin };
