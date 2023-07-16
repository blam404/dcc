"use server";

import { getPayloadClient } from "~payload/payloadClient";
import { User } from "~types/Payload.types";

type Info = {
	id: string;
	date: string;
	transactionType: string;
	secondType: string;
	expenseOther?: string;
	noOfPassenger?: number;
	from: {
		relationTo: string;
		value: string;
	} | null;
	to: {
		relationTo: string;
		value: string;
	} | null;
	paymentAmount: number;
	donationAmount: number;
	notes?: string | null;
	vehicle?: {
		relationTo: string;
		value: string;
	} | null;
	createdBy: {
		relationTo: "users";
		value: string;
	};
	updatedBy: {
		relationTo: "users";
		value: string;
	};
};

const createUpdate = async (info: Info, user: User) => {
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
		return {
			error: error.message,
		};
	}
};

export default createUpdate;
