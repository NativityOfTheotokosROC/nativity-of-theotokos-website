import { QueryClient, useQuery } from "@tanstack/react-query";
import { getNavigationUserInformation } from "../server-action/user";
import { Role } from "../type/general";
import { createContext } from "react";

export type NavigationUserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

export function useNavigationUserInformation(queryClient?: QueryClient) {
	const { data, isSuccess } = useQuery(
		{
			queryKey: ["navigation-user-information"],
			queryFn: getNavigationUserInformation,
		},
		queryClient,
	);
	if (isSuccess) return data satisfies NavigationUserInformation;
	return "pending";
}

export const NavigationUserInformationContext = createContext<
	NavigationUserInformation | "pending"
>("pending");
