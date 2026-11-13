export type ServerResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

// Returns the data from a server function result, or throws its error message.
export function unwrapResult<T>(result: ServerResult<T>): T {
	if (!result.success) {
		throw new Error(result.error);
	}
	return result.data;
}
