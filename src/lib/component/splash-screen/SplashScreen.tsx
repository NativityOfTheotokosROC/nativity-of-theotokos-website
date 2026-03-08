"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { SplashScreenModel } from "../../model/splash-screen";
import { motion, AnimatePresence } from "motion/react";
import "./splash-screen.css";
import { LogoIcon } from "../miscellaneous/graphic";
import { useLayoutEffect } from "react";

const SplashScreen = function ({ model }) {
	const { isShown, isFullscreen, exitedCallback } = model.modelView;
	const fullscreen = isFullscreen ?? true;

	useLayoutEffect(() => {
		// HACK: Revisit
		window.onscroll = () => {
			if (fullscreen && isShown) window.scrollTo(0, 0);
		};
	}, [isShown, fullscreen]);

	return (
		<AnimatePresence initial={false} onExitComplete={exitedCallback}>
			{isShown ? (
				<motion.div
					key="splash"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeIn" }}
					className={`splash flex flex-col w-full h-full bg-gray-900 overflow-hidden ${fullscreen && "absolute z-30 top-0 min-h-[110vh]"}`}
					data-fullscreen={fullscreen}
				>
					<div className="flex flex-col sticky top-0 items-center justify-center h-full max-h-dvh grow p-9">
						<motion.div
							key="splash-logo"
							initial={{ scale: 1, opacity: 1 }}
							exit={{ scale: 7, opacity: 0 }}
							transition={{ duration: 0.24, ease: "easeIn" }}
							className={`logo flex gap-3 items-center justify-center max-w-[25em] ${isShown && "animate-pulse"}`}
						>
							<LogoIcon className="logo-icon size-20 object-center object-contain" />
						</motion.div>
					</div>
				</motion.div>
			) : (
				<></>
			)}
		</AnimatePresence>
	);
} as ModeledVoidComponent<SplashScreenModel>;

export default SplashScreen;
