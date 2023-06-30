"use server";

import { getPayloadClient } from "../payload/payloadClient";

const getRecords = async (
	user,
	overrideAccess = true,
	collection,
	id = null,
	depth = 1
) => {
	const payload = await getPayloadClient();
	try {
		const results = await payload.find({
			collection,
			id,
			depth: depth,
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
