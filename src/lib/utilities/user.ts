import { QueryClient, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { getUserInformation } from "../server-actions/user";

export const ALL_USER_ROLES = [
	"admin",
	"staff",
	"user",
	"quotes",
	"writer",
	"editor",
	"scheduler",
] as const;

export type Role = (typeof ALL_USER_ROLES)[number];

export type UserInformation = {
	name: string;
	email: string;
	avatar?: {
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
