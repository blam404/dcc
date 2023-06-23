import {
	CollectionAfterChangeHook,
	CollectionBeforeChangeHook,
} from "payload/types";

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
	if (operation === "create") {
		const { from, to } = data;
		const totalPayment = data.donationAmount + data.paymentAmount;

		if (from.relationTo === "accounts") {
			const account = await payload.findByID({
				collection: from.relationTo,
				id: from.value,
			});
			data.fromRemaining = account.balance - totalPayment;
		} else {
			data.fromRemaining = null;
		}
		if (data.to.relationTo === "accounts") {
			const account = await payload.findByID({
				collection: to.relationTo,
				id: to.value,
			});
			data.toRemaining = account.balance + totalPayment;
		} else {
			data.toRemaining = null;
		}

		return data;
	} else if (operation === "update") {
		const { from, to } = data;
		const fromOriginal = originalDoc.from;
		const toOriginal = originalDoc.to;
		const total = data.paymentAmount + data.donationAmount;
		const totalOriginal =
			originalDoc.paymentAmount + originalDoc.donationAmount;

		// console.log("BEFORE CHANGE data 1: ", originalDoc);
		// console.log("BEFORE CHANGE data 2: ", data);
		console.log("1: ", data);
		if (user) {
			data.updatedBy = {
				value: user.id,
				relationTo: user.collection,
			};
		}

		if (data.updatedBy.value !== "6492312d69e524c5ca439c7a") {
			console.log("2.1: not udpated by bot");
			if (from?.value !== fromOriginal?.value) {
				console.log("2.20: The From value changed");
				if (from?.relationTo === "accounts") {
					console.log("2.21: from is an accout");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: from.value,
											},
										},
										{
											"to.value": {
												equals: from.value,
											},
										},
									],
								},
								{
									createdAt: {
										less_than: data.createdAt,
									},
								},
							],
						},
						sort: "-createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					console.log("2.22: transactions: ", transactions);
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

					console.log("2.23: previousBalance: ", previousBalance);

					data.fromRemaining = previousBalance - total;
				} else {
					console.timeLog("2.24: from is not an account");
					data.fromRemaining = null;
				}
			}
			if (to?.value !== toOriginal?.value) {
				console.log("2.30: The To value changed");
				if (to?.relationTo === "accounts") {
					console.log("2.31: to is an account");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: to.value,
											},
										},
										{
											"to.value": {
												equals: to.value,
											},
										},
									],
								},
								{
									createdAt: {
										less_than: data.createdAt,
									},
								},
							],
						},
						sort: "-createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					console.log("2.32: transactions: ", transactions);
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

					console.log("2.33: previousBalance: ", previousBalance);

					data.toRemaining = previousBalance + total;
				} else {
					console.log("2.34: to is not an account");
					data.toRemaining = null;
				}
			}
			if (
				from?.value === fromOriginal?.value &&
				to?.value === toOriginal?.value &&
				total !== totalOriginal
			) {
				console.log("3: Only the amount changed");
				const difference = total - totalOriginal;
				if (from?.relationTo === "accounts") {
					data.fromRemaining -= difference;
				}
				if (to?.relationTo === "accounts") {
					data.toRemaining += difference;
				}
			}
		}
	}
	//console.log("3.1: ", data);
	return data;
};

export const updateAccounts: CollectionAfterChangeHook = async ({
	doc,
	req: { payload },
	operation,
	previousDoc,
}) => {
	if (operation === "create") {
		const { from, to } = doc;
		const fromRemaining = doc.fromRemaining;
		const toRemaining = doc.toRemaining;

		if (fromRemaining) {
			await payload.update({
				collection: from.relationTo,
				id: from.value,
				data: {
					balance: fromRemaining,
				},
			});
		}
		if (toRemaining) {
			await payload.update({
				collection: to.relationTo,
				id: to.value,
				data: {
					balance: toRemaining,
				},
			});
		}
	} else if (operation === "update") {
		console.log("4: Running afterChange hook");
		const { from, to } = doc;
		const fromOriginal = previousDoc.from;
		const toOriginal = previousDoc.to;
		const total = doc.paymentAmount + doc.donationAmount;
		const totalOriginal =
			previousDoc.paymentAmount + previousDoc.donationAmount;
		const difference = totalOriginal - total;

		if (
			doc.updatedBy.value !== "6492312d69e524c5ca439c7a" &&
			doc.updatedBy.value?.id !== "6492312d69e524c5ca439c7a"
		) {
			// console.log("5 prevDoc: ", previousDoc);
			// console.log("5 doc: ", doc);
			if (
				from.value !== fromOriginal.value ||
				to.value !== toOriginal.value
			) {
				console.log("5: From or To value changed");
				const addBack: string[] = [];
				const subtractFrom: string[] = [];

				if (from.value !== fromOriginal.value) {
					console.log("5.1: from value changed");
					if (from.relationTo === "accounts") {
						subtractFrom.push(from.value);
					}
					if (fromOriginal.relationTo === "accounts") {
						addBack.push(fromOriginal.value);
					}
				}
				if (to.value !== toOriginal.value) {
					console.log("5.2: to value changed");
					if (to.relationTo === "accounts") {
						addBack.push(to.value);
					}
					if (toOriginal.relationTo === "accounts") {
						subtractFrom.push(toOriginal.value);
					}
				}

				addBack.forEach(async (accountId) => {
					console.log("5.3: running through addBack");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: accountId,
											},
										},
										{
											"to.value": {
												equals: accountId,
											},
										},
									],
								},
								{
									createdAt: {
										greater_than: doc.createdAt,
									},
								},
							],
						},
						sort: "+createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					console.log("5.4 transactions: ", transactions);
					if (transactions.length > 0) {
						transactions.forEach(async (transaction) => {
							console.log("5.5 running through each transaction");
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
										value: "6492312d69e524c5ca439c7a",
										relationTo: "users",
									},
								},
							});
						});
					}
					const account = await payload.findByID({
						collection: "accounts",
						id: accountId,
					});
					console.log("5.51 account: ", account);
					console.log("5.52 difference: ", difference);
					await payload.update({
						collection: "accounts",
						id: accountId,
						data: {
							balance: account.balance + total + difference,
						},
					});
				});

				subtractFrom.forEach(async (accountId) => {
					console.log("5.6 running through subtractFrom");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: accountId,
											},
										},
										{
											"to.value": {
												equals: accountId,
											},
										},
									],
								},
								{
									createdAt: {
										greater_than: doc.createdAt,
									},
								},
							],
						},
						sort: "+createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					console.log("5.7 transactions: ", transactions);
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
										value: "6492312d69e524c5ca439c7a",
										relationTo: "users",
									},
								},
							});
						});
					}
					const account = await payload.findByID({
						collection: "accounts",
						id: accountId,
					});
					console.log("5.71 account: ", account);
					console.log("5.72 difference: ", difference);
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
				console.log("6: Only the amount changed");
				if (from.relationTo === "accounts") {
					console.log("7: from is an account");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: from.value,
											},
										},
										{
											"to.value": {
												equals: from.value,
											},
										},
									],
								},
								{
									createdAt: {
										greater_than: doc.createdAt,
									},
								},
							],
						},
						sort: "+createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					transactions.forEach(async (transaction) => {
						console.log("8: transaction: ", transaction);
						const query = {
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
									value: "6492312d69e524c5ca439c7a",
									relationTo: "users",
								},
							},
							depth: 0,
						};
						console.log("8.1 query: ", query);
						const asdf = await payload.update(query);
						console.log("9: ", asdf);
					});
					console.log("10: ", from);
					const account = await payload.findByID({
						collection: "accounts",
						id: from.value,
					});
					console.log("10.1: ", account);
					const query = {
						balance: account.balance + difference,
					};
					console.log("10.2: ", query);
					await payload.update({
						collection: "accounts",
						id: from.value,
						data: query,
					});
				}
				console.log("11");
				if (to.relationTo === "accounts") {
					console.log("12: to is an account");
					const results = await payload.find({
						collection: "transactions",
						showHiddenFields: true,
						where: {
							and: [
								{
									or: [
										{
											"from.value": {
												equals: to.value,
											},
										},
										{
											"to.value": {
												equals: to.value,
											},
										},
									],
								},
								{
									createdAt: {
										greater_than: doc.createdAt,
									},
								},
							],
						},
						sort: "+createdAt",
						depth: 0,
					});
					const transactions = results.docs;
					console.log("13: transactions: ", transactions);
					transactions.forEach(async (transaction) => {
						const query = {
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
									value: "6492312d69e524c5ca439c7a",
									relationTo: "users",
								},
							},
							depth: 0,
						};
						console.log("13.1 query: ", query);
						const asdf = await payload.update(query);
					});

					const account = await payload.findByID({
						collection: "accounts",
						id: to.value,
					});
					const accResult = await payload.update({
						collection: "accounts",
						id: account.id,
						data: {
							balance: account.balance - difference,
						},
					});
					console.log("17: accResult: ", accResult);
				}
			}
		}
	}
};

/* updateAccounts operation === update original
} 
*/
