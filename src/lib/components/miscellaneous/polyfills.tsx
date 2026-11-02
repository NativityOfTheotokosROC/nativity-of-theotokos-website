"use client";
// Baseline support now available it seems
import "scroll-timeline-polyfill/dist/scroll-timeline.js";

const Polyfills = function ({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
};

export default Polyfills;
