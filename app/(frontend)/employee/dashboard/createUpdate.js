"use server";

import { getPayloadClient } from "../../../../payload/payloadClient";

const createUpdate = async (info, user) => {
	const payload = await getPayloadClient();
	const {
		id,
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

	const data = {
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
	};

	try {
		if (id) {
			console.log("updating");
			const results = await payload.update({
				collection: "transactions",
				id,
				data,
				user,
				overrideAccess: false,
				depth: 0,
			});

			return {
				success: results,
			};
		} else {
			console.log("creating");
			const results = await payload.create({
				collection: "transactions",
				data,
				user,
				overrideAccess: false,
				depth: 0,
			});
			return {
				success: results,
			};
		}
	} catch (error) {
		console.log("error: ", error.message);
		return {
			error: error.message,
		};
	}
};

export default createUpdate;
