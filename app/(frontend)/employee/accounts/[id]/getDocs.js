"use server";

import { getPayloadClient } from "../../../../../payload/payloadClient";

const getDocs = async (id) => {
	const payload = await getPayloadClient();

	try {
		const account = await payload.findByID({
			collection: "accounts",
			id: id,
		});

		const transactions = await payload.find({
			collection: "transactions",
			where: {
				or: [
					{
						"from.value": {
							equals: id,
						},
					},
					{
						"to.value": {
							equals: id,
						},
					},
				],
			},
			sort: "-date",
			depth: 1,
			overrideAccess: true,
		});
		return { success: true, transactions: transactions.docs, account };
	} catch (error) {
		return { error: error.message };
	}
};

export default getDocs;
