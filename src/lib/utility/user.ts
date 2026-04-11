import { QueryClient, useQuery } from "@tanstack/react-query";
import { getNavigationUserDetails } from "../server-action/user";
import { Role } from "../type/general";

export type NavigationUserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

export function useNavigationUserInformation(queryClient?: QueryClient) {
	const { data, isPending, isSuccess } = useQuery(
		{
			queryKey: ["navigation-user-information"],
			queryFn: getNavigationUserDetails,
		},
		queryClient,
	);
	if (isPending) return "pending";
	if (isSuccess) return data satisfies NavigationUserInformation;
}
