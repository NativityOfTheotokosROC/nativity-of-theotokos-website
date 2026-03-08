import SplashScreen from "@/src/lib/component/splash-screen/SplashScreen";
import "./loading.css";
import { newReadonlyModel } from "@mvc-react/mvc";

export default function Loading() {
	return (
		<div className="loading flex flex-col min-h-[78lvh]">
			<SplashScreen
				model={newReadonlyModel({
					isShown: true,
					isFullscreen: false,
				})}
			/>
		</div>
	);
}
