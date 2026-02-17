import { getBaseURL } from "../server-action/miscellaneous";

const useOrigin = function (): Promise<string> {
	if (window) return Promise.resolve(window.location.origin);
	return getBaseURL();
};

export { useOrigin };
