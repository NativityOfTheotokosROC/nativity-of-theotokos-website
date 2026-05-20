export class UninitializedModelError extends Error {
	message: string;

	constructor(message?: string) {
		super();
		this.name = "UninitializedModelError";
		this.message = message ?? "Model is not initialized";
	}
}
