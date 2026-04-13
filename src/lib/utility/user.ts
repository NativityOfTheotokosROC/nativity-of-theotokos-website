import { QueryClient, useQuery } from "@tanstack/react-query";
import { getUserInformation } from "../server-action/user";
import { Role } from "../type/general";
import { createContext } from "react";

export type UserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

export function useUserInformation(queryClient?: QueryClient) {
	const { data, isSuccess } = useQuery(
		{
			queryKey: ["user-information"],
			queryFn: getUserInformation,
			staleTime: Infinity,
			gcTime: Infinity,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
		},
		queryClient,
	);
	if (isSuccess) return data satisfies UserInformation;
	return "pending";
}

export const UserInformationContext =
	createContext<ReturnType<typeof useUserInformation>>("pending");
