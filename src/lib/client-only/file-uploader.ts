import "client-only";

export async function uploadFile(file: File, presignedUrl: string) {
	const body = new Blob([file], { type: file.type });
	await fetch(presignedUrl, {
		method: "PUT",
		body,
	});
	return presignedUrl.split("?")[0];
}

// export function useFileUpload(file: File, presignedUrl: string, queryClient?: QueryClient) {
// 	const {mutate} = useMutation({mutationFn: async () => {},}, queryClient);
// }
