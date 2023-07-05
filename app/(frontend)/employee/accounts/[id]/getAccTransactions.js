"use server";

import { getPayloadClient } from "../../../../../payload/payloadClient";

const getAccTransactions = async (id, limit = 10, page) => {
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
			limit,
			page: page || 1,
		});
		return { success: true, transactions: transactions, account };
	} catch (error) {
		return { error: error.message };
	}
};

export default getAccTransactions;
