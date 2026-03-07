import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const { signIn, useSession, signOut } = createAuthClient({
	plugins: [genericOAuthClient()],
});
