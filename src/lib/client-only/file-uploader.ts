import "client-only";

export async function uploadFile(file: File, presignedUrl: string) {
	const body = new Blob([file], { type: file.type });
	const response = await fetch(presignedUrl, {
		method: "PUT",
		body,
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return presignedUrl.split("?")[0];
}

// export function useFileUpload(file: File, presignedUrl: string, queryClient?: QueryClient) {
// 	const {mutate} = useMutation({mutationFn: async () => {},}, queryClient);
// }
