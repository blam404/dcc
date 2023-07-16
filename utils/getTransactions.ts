"use server";

import { getPayloadClient } from "~payload/payloadClient";

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

const getTransactions = async (
	user: User,
	limit: number = 10,
	pagination: boolean = true,
	greaterThan?: Date,
	lessThan?: Date,
	depth: number = 1
) => {
	const payload = await getPayloadClient();

	let dateFilter = {};

	if (greaterThan && lessThan) {
		dateFilter = {
			and: [
				{
					date: {
						greater_than: greaterThan,
					},
				},
				{
					date: {
						less_than: lessThan || JSON.stringify(new Date()),
					},
				},
			],
		};
	} else if (greaterThan && !lessThan) {
		dateFilter = {
			date: {
				greater_than: greaterThan,
			},
		};
	} else if (!greaterThan && lessThan) {
		dateFilter = {
			date: {
				less_than: lessThan,
			},
		};
	}

	try {
		const results = await payload.find({
			collection: "transactions",
			where: dateFilter,
			depth,
			limit,
			overrideAccess: false,
			user,
			sort: "-date",
			pagination,
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

export default getTransactions;
