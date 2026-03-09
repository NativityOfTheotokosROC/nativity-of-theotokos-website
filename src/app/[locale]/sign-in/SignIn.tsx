import { SignInModel } from "@/src/lib/model/sign-in";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import SignInButton from "@/src/lib/component/sign-in-button/SignInButton";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const SignIn = function ({ model }) {
	const { modelView, interact } = model;
	const { signInStatus, signInServices } = modelView;
	const t = useTranslations("signIn");

	return (
		<main className="sign-in bg-[#FEF8F3] text-black border-t-15 border-t-red-900">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{
					opacity: 1,
					y: 0,
				}}
				viewport={{ once: true }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="sign-in-content flex flex-col min-h-[70lvh] gap-6 p-8 py-9 lg:px-20 md:py-10"
			>
				<span
					className={`text-[2.75rem]/tight w-3/4 mb-2 font-semibold md:text-black md:w-1/2 ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<p className="text-lg">{t("description")}</p>
				<div className="flex flex-col gap-3 max-w-3/4 md:max-w-[20em]">
					{[
						...signInServices.map(service => (
							<SignInButton
								key={service}
								model={{
									modelView: {
										signInService: service,
										isEnabled: !(
											signInStatus?.type == "pending" ||
											signInStatus?.type == "success"
										),
									},
									interact: interaction => {
										switch (interaction.type) {
											case "SIGN_IN": {
												interact({
													type: "SIGN_IN",
													input: {
														signInService: service,
													},
												});
											}
										}
									},
								}}
							/>
						)),
					]}
				</div>
				{(signInStatus?.type == "success" ||
					signInStatus?.type == "failed") && (
					<span
						className={`text-sm/tight line-clamp-3 ${signInStatus.type == "failed" && "text-red-900"}`}
					>
						{signInStatus.message}
					</span>
				)}
			</motion.div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<SignInModel>>;

export default SignIn;
