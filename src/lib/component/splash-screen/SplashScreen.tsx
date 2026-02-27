import { ModeledVoidComponent } from "@mvc-react/components";
import { SplashScreenModel } from "../../model/splash-screen";
import { motion, AnimatePresence } from "motion/react";
import "./splash-screen.css";
import { LogoIcon } from "../miscellaneous/graphic";
import { useLayoutEffect } from "react";

const SplashScreen = function ({ model }) {
	const { isShown, exitedCallback } = model.modelView;
	
	useLayoutEffect(() => {
		window.onscroll = () => {
			if (isShown)
				window.scrollTo(0, 0);
		}
	}, [isShown])

	return (
		<AnimatePresence initial={false} onExitComplete={exitedCallback}>
			{isShown ? (
				<motion.div
					key="splash"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4, ease: "easeIn" }}
					className="splash flex absolute w-screen h-dvh z-30 top-0 overflow-hidden"
				>
					<div className="bg-gray-900 flex items-center justify-center grow p-9">
						<motion.div
							key="splash-logo"
							initial={{ scale: 1, opacity: 1 }}
							exit={{ scale: 7, opacity: 0 }}
							transition={{ duration: 0.24, ease: "easeIn" }}
							className={`logo flex gap-3 items-center justify-center max-w-[25em] ${isShown && "animate-pulse"}`}
						>
							<LogoIcon className="size-20 object-center object-contain" />
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
