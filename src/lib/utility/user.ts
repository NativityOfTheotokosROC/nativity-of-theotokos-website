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

export function useNavigationUserInformation(
	queryClient?: QueryClient,
): NavigationUserInformation | "pending" {
	const query = useQuery(
		{
			queryKey: ["navigation-user-information"],
			queryFn: getNavigationUserDetails,
			staleTime: Infinity,
			gcTime: Infinity,
		},
		queryClient,
	);
	return query.data == undefined ? "pending" : query.data;
}
