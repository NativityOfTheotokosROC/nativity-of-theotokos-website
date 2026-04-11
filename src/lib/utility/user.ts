import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { getNavigationUserDetails } from "../server-action/user";
import { Role } from "../type/general";

export type NavigationUserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

export function useNavigationUserInformation():
	| NavigationUserInformation
	| "pending" {
	const query = useQuery({
		queryKey: ["navigation-user-information"],
		queryFn: getNavigationUserDetails,
		staleTime: Infinity,
		gcTime: Infinity,
	});

	return query.data == undefined ? "pending" : query.data;
}

export const NavigationUserInformationContext = createContext<
	NavigationUserInformation | "pending"
>("pending");
