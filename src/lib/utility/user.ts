import { QueryClient } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { getUserInformation } from "../server-action/user";
import { Role } from "../type/general";

export type UserInformation = {
	name: string;
	avatar: {
		source: string;
	};
	roles: Role[];
} | null;

export function useUserInformation(queryClient?: QueryClient) {
	const [userInformation, setUserInformation] = useState<
		UserInformation | undefined
	>();
	useEffect(() => {
		if (userInformation == undefined)
			getUserInformation().then(userInformation =>
				setUserInformation(userInformation),
			);
	}, [userInformation]);

	return userInformation == undefined ? "pending" : userInformation;
	// const { data, isSuccess } = useQuery(
	// 	{
	// 		queryKey: ["user-information"],
	// 		queryFn: getUserInformation,
	// 		staleTime: Infinity,
	// 		gcTime: Infinity,
	// 		refetchOnMount: false,
	// 		refetchOnReconnect: false,
	// 		refetchOnWindowFocus: false,
	// 	},
	// 	queryClient,
	// );
	// if (isSuccess) return data satisfies UserInformation;
	// return "pending";
}

export const UserInformationContext =
	createContext<ReturnType<typeof useUserInformation>>("pending");
