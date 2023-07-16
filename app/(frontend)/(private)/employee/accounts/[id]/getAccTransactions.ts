"use server";

import { getPayloadClient } from "~payload/payloadClient";
import { Account } from "~types/Payload.types";
import { Meta } from "~types/PayloadAdd.types";

type Return =
	| {
			success: boolean;
			transactions: Meta;
			account: Account;
			error?: undefined;
	  }
	| {
			error: string;
			success?: undefined;
			transactions?: undefined;
			account?: undefined;
	  };

const getAccTransactions = async (
	id: string,
	limit?: number | null,
	page?: number
): Promise<Return> => {
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
			limit: limit || 10,
			page: page || 1,
		});
		return { success: true, transactions: transactions, account };
	} catch (error) {
		return { error: error.message };
	}
};

export default getAccTransactions;
