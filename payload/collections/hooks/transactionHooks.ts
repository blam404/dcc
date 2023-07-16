import {
	CollectionAfterChangeHook,
	CollectionBeforeChangeHook,
} from "payload/types";

import { botUser } from "~utils/companySpecifics";

export const updateToFrom: CollectionBeforeChangeHook = async ({
	data,
	req,
}) => {
	const { payload } = req;
	let { from, to } = data;

	if (!from) {
		if (
			data?.transactionType === "revenue" ||
			data?.transactionType === "donation"
		) {
			const record = await payload.find({
				collection: "companies",
				where: {
					companyName: {
						equals: "Passenger",
					},
				},
			});
			from = {
				value: record?.docs[0].id,
				relationTo: "companies",
			};
		} else if (data?.expenseType === "cashCab") {
			const record = await payload.find({
				collection: "accounts",
				where: {
					accountName: {
						equals: "Cash Cab Account",
					},
				},
			});
			from = {
				value: record?.docs[0].id,
				relationTo: "accounts",
			};
		} else if (
			data?.transactionType === "expense" &&
			data?.expenseType !== "cashCab"
		) {
			const record = await payload.find({
				collection: "accounts",
				where: {
					accountName: {
						equals: "Downtown Cab Co",
					},
				},
			});
			from = {
				value: record?.docs[0].id,
				relationTo: "accounts",
			};
		}
	}
	if (!to) {
		if (
			data?.transactionType === "revenue" ||
			data?.donationType === "general"
		) {
			const record = await payload.find({
				collection: "accounts",
				where: {
					accountName: {
						equals: "Downtown Cab Co",
					},
				},
			});
			to = {
				value: record?.docs[0].id,
				relationTo: "accounts",
			};
		} else if (data?.donationType === "cashCab") {
			const record = await payload.find({
				collection: "accounts",
				where: {
					accountName: {
						equals: "Cash Cab Account",
					},
				},
			});
			to = {
				value: record?.docs[0].id,
				relationTo: "accounts",
			};
		} else if (data?.expenseType === "cashCab") {
			const record = await payload.find({
				collection: "companies",
				where: {
					companyName: {
						equals: "Donor",
					},
				},
			});
			to = {
				value: record?.docs[0].id,
				relationTo: "companies",
			};
		} else if (
			data?.transactionType === "expense" &&
			data?.expenseType !== "cashCab"
		) {
			to = {
				value: req.user.id,
				relationTo: "users",
			};
		}
	}

	return { ...data, from, to };
};

export const nullConditionalFields: CollectionBeforeChangeHook = async ({
	data,
}) => {
	const { transactionType } = data;

	if (transactionType === "donation") {
		data.expenseType = null;
		data.expenseOther = null;
		data.revenueType = null;
		data.noOfPassenger = null;
		data.paymentAmount = 0;
	} else if (transactionType === "revenue") {
		data.donationType = null;
		data.expenseType = null;
		data.expenseOther = null;
	} else if (transactionType === "expense") {
		data.donationType = null;
		data.donationAmount = 0;
		data.revenueType = null;
		data.noOfPassenger = null;
	}

	return data;
};

export const fillRemainingBalance: CollectionBeforeChangeHook = async ({
	data,
	req,
	operation,
	originalDoc,
}) => {
	const { payload, user } = req;
	const { from, to, date } = data;

	if (operation === "create") {
		const totalPayment = data.donationAmount + data.paymentAmount;

		if (from.relationTo === "accounts") {
			const account = await payload.findByID({
				collection: from.relationTo,
				id: from.value,
			});

			const oldTransactions = await getOldTransactions(
				payload,
				from.value,
				date
			);

			if (oldTransactions.length > 0) {
				const previousTransaction = oldTransactions[0];
				const previousRemaining =
					previousTransaction.from.value === from.value
						? previousTransaction.fromRemaining
						: previousTransaction.toRemaining;
				data.fromRemaining = previousRemaining - totalPayment;
			} else {
				data.fromRemaining = account.startingBalance - totalPayment;
			}
		} else {
			data.fromRemaining = null;
		}
		if (to.relationTo === "accounts") {
			const account = await payload.findByID({
				collection: to.relationTo,
				id: to.value,
			});

			const oldTransactions = await getOldTransactions(
				payload,
				to.value,
				date
			);

			if (oldTransactions.length > 0) {
				const previousTransaction = oldTransactions[0];
				const previousRemaining =
					previousTransaction.from.value === to.value
						? previousTransaction.fromRemaining
						: previousTransaction.toRemaining;
				data.toRemaining = previousRemaining + totalPayment;
			} else {
				data.toRemaining = account.startingBalance + totalPayment;
			}
		} else {
			data.toRemaining = null;
		}

		return data;
	} else if (operation === "update") {
		const fromOriginal = originalDoc.from;
		const toOriginal = originalDoc.to;
		const total = data.paymentAmount + data.donationAmount;
		const totalOriginal =
			originalDoc.paymentAmount + originalDoc.donationAmount;

		if (user) {
			data.updatedBy = {
				value: user.id,
				relationTo: "users",
			};
		}

		//if not updated by the "bot" account to prevent infinite loop
		//figure out a way to do this without hard coding an account
		if (data.updatedBy.value !== botUser.id) {
			if (from?.value !== fromOriginal?.value) {
				if (from?.relationTo === "accounts") {
					const transactions = await getOldTransactions(
						payload,
						from.value,
						date
					);

					let previousBalance;
					if (transactions.length > 0) {
						const previousTransaction = transactions[0];

						if (previousTransaction.from.value === from.value) {
							previousBalance = previousTransaction.fromRemaining;
						} else {
							previousBalance = previousTransaction.toRemaining;
						}
					} else {
						const account = await payload.findByID({
							collection: "accounts",
							id: from.value,
						});
						previousBalance = account.startingBalance;
					}

					data.fromRemaining = previousBalance - total;
				} else {
					data.fromRemaining = null;
				}
			}
			if (to?.value !== toOriginal?.value) {
				if (to?.relationTo === "accounts") {
					const transactions = await getOldTransactions(
						payload,
						to.value,
						date
					);

					let previousBalance;
					if (transactions.length > 0) {
						const previousTransaction = transactions[0];
						if (previousTransaction.from.value === to.value) {
							previousBalance = previousTransaction.fromRemaining;
						} else {
							previousBalance = previousTransaction.toRemaining;
						}
					} else {
						const account = await payload.findByID({
							collection: "accounts",
							id: to.value,
						});
						previousBalance = account.startingBalance;
					}

					data.toRemaining = previousBalance + total;
				} else {
					data.toRemaining = null;
				}
			}
			if (
				from?.value === fromOriginal?.value &&
				to?.value === toOriginal?.value &&
				total !== totalOriginal
			) {
				const difference = total - totalOriginal;

				if (from?.relationTo === "accounts") {
					data.fromRemaining = originalDoc.fromRemaining - difference;
				}
				if (to?.relationTo === "accounts") {
					data.toRemaining = originalDoc.toRemaining + difference;
				}
			}
		}

		return data;
	}
};

export const updateAccounts: CollectionAfterChangeHook = async ({
	doc,
	req: { payload },
	operation,
	previousDoc,
}) => {
	const { from, to, date } = doc;
	const total = doc.paymentAmount + doc.donationAmount;

	if (operation === "create") {
		if (from.relationTo === "accounts") {
			const transactions = await getNewTransactions(
				payload,
				from.value,
				date
			);

			if (transactions.length > 0) {
				transactions.forEach(async (transaction) => {
					await payload.update({
						collection: "transactions",
						id: transaction.id,
						data: {
							fromRemaining:
								transaction.from.value === from.value
									? transaction.fromRemaining - total
									: transaction.fromRemaining,
							toRemaining:
								transaction.to.value === from.value
									? transaction.toRemaining - total
									: transaction.toRemaining,
							updatedBy: {
								value: botUser.id,
								relationTo: "users",
							},
						},
						user: botUser,
					});
				});
			}

			const account = await payload.findByID({
				collection: "accounts",
				id: from.value,
			});

			await payload.update({
				collection: "accounts",
				id: from.value,
				data: {
					balance: account.balance - total,
				},
			});
		}
		if (to.relationTo === "accounts") {
			const transactions = await getNewTransactions(
				payload,
				to.value,
				date
			);

			if (transactions.length > 0) {
				transactions.forEach(async (transaction) => {
					await payload.update({
						collection: "transactions",
						id: transaction.id,
						data: {
							fromRemaining:
								transaction.from.value === to.value
									? transaction.fromRemaining + total
									: transaction.fromRemaining,
							toRemaining:
								transaction.to.value === to.value
									? transaction.toRemaining + total
									: transaction.toRemaining,
							updatedBy: {
								value: botUser.id,
								relationTo: "users",
							},
						},
						user: botUser,
					});
				});
			}

			const account = await payload.findByID({
				collection: "accounts",
				id: to.value,
			});

			await payload.update({
				collection: "accounts",
				id: to.value,
				data: {
					balance: account.balance + total,
				},
			});
		}
	} else if (operation === "update") {
		const fromOriginal = previousDoc.from;
		const toOriginal = previousDoc.to;
		const totalOriginal =
			previousDoc.paymentAmount + previousDoc.donationAmount;
		const difference = totalOriginal - total;

		//this checks for the "bot" account when depth=0 and depth=1
		if (
			doc.updatedBy.value !== botUser.id &&
			doc.updatedBy.value?.id !== botUser.id
		) {
			if (
				from.value !== fromOriginal.value ||
				to.value !== toOriginal.value
			) {
				const addBack: string[] = [];
				const subtractFrom: string[] = [];

				if (from.value !== fromOriginal.value) {
					if (from.relationTo === "accounts") {
						subtractFrom.push(from.value);
					}
					if (fromOriginal.relationTo === "accounts") {
						addBack.push(fromOriginal.value);
					}
				}
				if (to.value !== toOriginal.value) {
					if (to.relationTo === "accounts") {
						addBack.push(to.value);
					}
					if (toOriginal.relationTo === "accounts") {
						subtractFrom.push(toOriginal.value);
					}
				}

				addBack.forEach(async (accountId) => {
					const transactions = await getNewTransactions(
						payload,
						accountId,
						date
					);

					if (transactions.length > 0) {
						transactions.forEach(async (transaction) => {
							await payload.update({
								collection: "transactions",
								id: transaction.id,
								data: {
									fromRemaining:
										transaction.from.value === accountId
											? transaction.fromRemaining +
											  total -
											  difference
											: transaction.fromRemaining,
									toRemaining:
										transaction.to.value === accountId
											? transaction.toRemaining +
											  total -
											  difference
											: transaction.toRemaining,
									updatedBy: {
										value: botUser.id,
										relationTo: "users",
									},
								},
								user: botUser,
							});
						});
					}
					const account = await payload.findByID({
						collection: "accounts",
						id: accountId,
					});

					await payload.update({
						collection: "accounts",
						id: accountId,
						data: {
							balance: account.balance + total + difference,
						},
					});
				});

				subtractFrom.forEach(async (accountId) => {
					const transactions = await getNewTransactions(
						payload,
						accountId,
						date
					);

					if (transactions.length > 0) {
						transactions.forEach(async (transaction) => {
							await payload.update({
								collection: "transactions",
								id: transaction.id,
								data: {
									fromRemaining:
										transaction.from.value === accountId
											? transaction.fromRemaining -
											  total +
											  difference
											: transaction.fromRemaining,
									toRemaining:
										transaction.to.value === accountId
											? transaction.toRemaining -
											  total +
											  difference
											: transaction.toRemaining,
									updatedBy: {
										value: botUser.id,
										relationTo: "users",
									},
								},
								user: botUser,
							});
						});
					}
					const account = await payload.findByID({
						collection: "accounts",
						id: accountId,
					});

					await payload.update({
						collection: "accounts",
						id: accountId,
						data: {
							balance: account.balance - total + difference,
						},
					});
				});
			}

			if (
				from.value === fromOriginal.value &&
				to.value === toOriginal.value &&
				total !== totalOriginal
			) {
				if (from.relationTo === "accounts") {
					const transactions = await getNewTransactions(
						payload,
						from.value,
						date
					);

					transactions.forEach(async (transaction) => {
						await payload.update({
							collection: "transactions",
							id: transaction.id,
							data: {
								fromRemaining:
									transaction.from.value === from.value
										? transaction.fromRemaining + difference
										: transaction.fromRemaining,
								toRemaining:
									transaction.to.value === from.value
										? transaction.toRemaining + difference
										: transaction.toRemaining,
								updatedBy: {
									value: botUser.id,
									relationTo: "users",
								},
							},
							depth: 0,
							user: botUser,
						});
					});

					const account = await payload.findByID({
						collection: "accounts",
						id: from.value,
					});

					await payload.update({
						collection: "accounts",
						id: from.value,
						data: {
							balance: account.balance + difference,
						},
					});
				}

				if (to.relationTo === "accounts") {
					const transactions = await getNewTransactions(
						payload,
						to.value,
						date
					);

					transactions.forEach(async (transaction) => {
						await payload.update({
							collection: "transactions",
							id: transaction.id,
							data: {
								fromRemaining:
									transaction.from.value === to.value
										? transaction.fromRemaining - difference
										: transaction.fromRemaining,
								toRemaining:
									transaction.to.value === to.value
										? transaction.toRemaining - difference
										: transaction.toRemaining,
								updatedBy: {
									value: botUser.id,
									relationTo: "users",
								},
							},
							depth: 0,
							user: botUser,
						});
					});

					const account = await payload.findByID({
						collection: "accounts",
						id: to.value,
					});
					await payload.update({
						collection: "accounts",
						id: account.id,
						data: {
							balance: account.balance - difference,
						},
					});
				}
			}
		}
	}
};

const getOldTransactions = async (payload, id, date) => {
	const oldTransactions = await payload.find({
		collection: "transactions",
		where: {
			and: [
				{
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
				{
					date: {
						less_than: date,
					},
				},
			],
		},
		sort: "-date",
		depth: 0,
		user: botUser,
	});
	return oldTransactions.docs;
};

const getNewTransactions = async (payload, id, date) => {
	const oldTransactions = await payload.find({
		collection: "transactions",
		where: {
			and: [
				{
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
				{
					date: {
						greater_than: date,
					},
				},
			],
		},
		sort: "+date",
		depth: 0,
		user: botUser,
	});
	return oldTransactions.docs;
};
