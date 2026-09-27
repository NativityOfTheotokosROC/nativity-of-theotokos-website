"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { SplashScreenModel } from "../../models/splash-screen";
import { motion, AnimatePresence } from "motion/react";
import "./splash-screen.css";
import LogoIcon from "@/public/assets/logo-icon.svg";
import { useEffect, useLayoutEffect, ViewTransition } from "react";
import { scrollToElement } from "../../client-only/miscellaneous";

const SplashScreen = function ({ model }) {
	const { isShown, exitedCallback } = model.modelView;

	useLayoutEffect(() => {
		// HACK: Revisit
		const scrollEventCallback = () => {
			if (isShown) window.scrollTo(0, 0);
		};
		window.addEventListener("scroll", scrollEventCallback);
		return () => {
			window.removeEventListener("scroll", scrollEventCallback);
		};
	}, [isShown]);

	useEffect(() => {
		const hashId = window.location.hash;
		if (hashId && !isShown) scrollToElement(hashId);
	}, [isShown]);

	return (
		<AnimatePresence initial={false} onExitComplete={exitedCallback}>
			{isShown && (
				<motion.div
					key="splash"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeIn" }}
					className={`splash absolute top-0 z-30 flex h-full min-h-[110vh] w-full flex-col overflow-hidden`}
					data-fullscreen
				>
					<div className="sticky top-0 flex h-full max-h-dvh grow flex-col items-center justify-center p-9">
						<motion.div
							key="splash-logo"
							initial={{ scale: 1, opacity: 1 }}
							exit={{ scale: 7, opacity: 0 }}
							transition={{ duration: 0.24, ease: "easeIn" }}
							className={`logo flex max-w-[25em] items-center justify-center gap-3 ${isShown && "animate-pulse"}`}
						>
							<ViewTransition name="logo-icon">
								<LogoIcon className="logo-icon size-20 object-contain object-center" />
							</ViewTransition>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
} as ModeledVoidComponent<SplashScreenModel>;

export default SplashScreen;
