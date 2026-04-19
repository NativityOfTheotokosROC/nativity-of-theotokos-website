import { SignInModel } from "@/src/lib/models/sign-in";
import { georgia } from "@/src/lib/third-party/fonts";
import { ModeledVoidComponent } from "@mvc-react/components";
import { InitializedModel } from "@mvc-react/mvc";
import SignInButton from "@/src/lib/components/sign-in-button/SignInButton";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

const SignIn = function ({ model }) {
	const { modelView, interact } = model;
	const { signInStatus, signInServices, selectedService } = modelView;
	const t = useTranslations("signIn");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<main className="sign-in border-t-15 border-t-red-900 bg-[#FEF8F3] text-black">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: 1,
					y: 0,
				}}
				viewport={{ once: true }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="sign-in-content flex min-h-[94svh] flex-col gap-6 p-8 py-9 md:py-10 lg:px-20"
			>
				<span
					className={`mb-2 text-[2.75rem]/tight font-semibold md:w-1/2 md:text-black ${georgia.className}`}
				>
					{t("title")}
					<hr className="mt-4 mb-0 md:w-full" />
				</span>
				<p className="text-lg">{t("description")}</p>
				<div className="flex max-w-3/4 flex-col gap-3 md:max-w-[20em]">
					{[
						...signInServices.map(service => (
							<SignInButton
								key={service}
								model={{
									modelView: {
										signInService: service,
										isEnabled: !(
											signInStatus?.type === "pending" ||
											signInStatus?.type === "success"
										),
										isSelected: service === selectedService,
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
				{(signInStatus?.type === "success" ||
					signInStatus?.type === "failed") && (
					<span
						className={`mt-3 line-clamp-3 text-sm/tight ${signInStatus.type === "failed" && "text-red-900"}`}
					>
						{signInStatus.message}
					</span>
				)}
			</motion.div>
		</main>
	);
} satisfies ModeledVoidComponent<InitializedModel<SignInModel>>;

export default SignIn;
