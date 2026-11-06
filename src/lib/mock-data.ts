// Still used for the sidebar user area; the rest of the dashboard reads from the database.
export interface MockUser {
	id: string;
	name: string;
	email: string;
}

export const MOCK_USER: MockUser = {
	id: "user-1",
	name: "John Doe",
	email: "john@example.com",
};
