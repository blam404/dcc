"use server";

import { getPayloadClient } from "../payload/payloadClient";

type User = {
	backAccount?: string;
	characterName: string;
	createdAt: string;
	discord?: string;
	email: string;
	enableAPIKey?: boolean;
	id: string;
	phoneNumber?: string;
	roles: string;
	timezone?: string;
	updatedAt: string;
	_strategy?: string;
} | null;

const getRecords = async (
	user: User,
	overrideAccess: boolean = true,
	collection: string,
	depth: number = 1
) => {
	const payload = await getPayloadClient();
	try {
		const results = await payload.find({
			collection,
			depth,
			limit: 10,
			overrideAccess,
			user,
			sort: "-date",
		});
		return {
			success: results.docs,
		};
	} catch (error) {
		return {
			error: error.message,
		};
	}
};

export default getRecords;
