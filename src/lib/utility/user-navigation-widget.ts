import { useSuspenseQuery } from "@tanstack/react-query";
import { getNavigationUserDetails } from "../server-action/user";

export function useNavigationUserDetails() {
	const navigationUserDetails = useSuspenseQuery({
		queryKey: ["navigation-user-details"],
		queryFn: getNavigationUserDetails,
	});

	return navigationUserDetails.data;
}
