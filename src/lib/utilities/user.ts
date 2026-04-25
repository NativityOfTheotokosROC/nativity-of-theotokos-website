import { QueryClient, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { getUserInformation } from "../server-actions/user";
import { Role } from "../types/general";

export type UserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

const queryKey = ["user-information"];

export function useUserInformation(queryClient?: QueryClient) {
	const { data, isSuccess } = useQuery(
		{
			queryKey,
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

export async function refreshUserInformation(queryClient: QueryClient) {
	await queryClient.invalidateQueries({ queryKey });
}

export const UserInformationContext =
	createContext<ReturnType<typeof useUserInformation>>("pending");
