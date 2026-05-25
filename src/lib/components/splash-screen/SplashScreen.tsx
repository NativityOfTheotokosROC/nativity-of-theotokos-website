"use client";

import { ModeledVoidComponent } from "@mvc-react/components";
import { SplashScreenModel } from "../../models/splash-screen";
import { motion, AnimatePresence } from "motion/react";
import "./splash-screen.css";
import LogoIcon from "@/public/assets/logo-icon.svg";
import { useLayoutEffect, ViewTransition } from "react";

const SplashScreen = function ({ model }) {
	const { isShown, isFullscreen, exitedCallback } = model.modelView;
	const fullscreen = isFullscreen ?? true;

	useLayoutEffect(() => {
		// HACK: Revisit
		window.onscroll = () => {
			if (isShown && fullscreen) window.scrollTo(0, 0);
		};
	}, [isShown, fullscreen]);

	return (
		<AnimatePresence initial={false} onExitComplete={exitedCallback}>
			{isShown && (
				<motion.div
					key="splash"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeIn" }}
					className={`splash flex h-full w-full flex-col overflow-hidden ${fullscreen && "absolute top-0 z-30 min-h-[110vh]"}`}
					data-fullscreen={fullscreen}
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
