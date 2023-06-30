"use server";

import { getPayloadClient } from "../../../../payload/payloadClient";

const createTransaction = async (info, user) => {
	const payload = await getPayloadClient();
	const {
		date,
		transactionType,
		secondType,
		expenseOther,
		noOfPassenger,
		from,
		to,
		paymentAmount,
		donationAmount,
		notes,
		vehicle,
		createdBy,
		updatedBy,
	} = info;

	let revenueType;
	let donationType;
	let expenseType;

	if (transactionType === "revenue") {
		revenueType = secondType;
		donationType = null;
		expenseType = null;
	} else if (transactionType === "donation") {
		revenueType = null;
		donationType = secondType;
		expenseType = null;
	} else if (transactionType === "expense") {
		revenueType = null;
		donationType = null;
		expenseType = secondType;
	}

	try {
		const results = await payload.create({
			collection: "transactions",
			data: {
				date,
				transactionType,
				revenueType,
				donationType,
				expenseType,
				expenseOther,
				noOfPassenger,
				paymentAmount,
				donationAmount,
				from,
				to,
				notes,
				vehicle,
				createdBy,
				updatedBy,
			},
			user,
			overrideAccess: false,
			depth: 0,
		});
		return {
			success: results,
		};
	} catch (error) {
		return {
			error: error.message,
		};
	}
};

export default createTransaction;
