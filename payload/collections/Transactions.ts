import { CollectionAfterChangeHook, CollectionConfig } from "payload/types";

const updateBankAccount: CollectionAfterChangeHook = async ({
	doc,
	req: { payload },
	previousDoc,
	operation,
}) => {
	if (operation === "create") {
		if (
			doc.from?.value === doc.to?.value ||
			doc.to?.relationTo === "accounts"
		) {
			const account = await payload.findByID({
				collection: doc.to.relationTo,
				id: doc.to.value,
			});

			const accountBalance = account.balance;

			await payload.update({
				collection: doc.to.relationTo,
				id: doc.to.value,
				data: {
					balance: accountBalance + doc.amount,
				},
			});
		}
		if (
			doc.from?.relationTo === "accounts" &&
			doc.from?.value !== doc.to?.value
		) {
			const account = await payload.findByID({
				collection: doc.from.relationTo,
				id: doc.from.value,
			});

			const accountBalance = account.balance;

			await payload.update({
				collection: doc.from.relationTo,
				id: doc.from.value,
				data: {
					balance: accountBalance - doc.amount,
				},
			});
		}
	} else if (operation === "update") {
		const difference = doc.amount - previousDoc.amount;

		if (
			doc.from?.value === doc.to?.value ||
			doc.to?.relationTo === "accounts"
		) {
			const account = await payload.findByID({
				collection: doc.to.relationTo,
				id: doc.to.value,
			});

			const accountBalance = account.balance;

			await payload.update({
				collection: doc.to.relationTo,
				id: doc.to.value,
				data: {
					balance: accountBalance + difference,
				},
			});
		}
		if (
			doc.from?.relationTo === "accounts" &&
			doc.from?.value !== doc.to?.value
		) {
			const account = await payload.findByID({
				collection: doc.from.relationTo,
				id: doc.from.value,
			});

			const accountBalance = account.balance;

			await payload.update({
				collection: doc.from.relationTo,
				id: doc.from.value,
				data: {
					balance: accountBalance - difference,
				},
			});
		}
	}
};

export const Transactions: CollectionConfig = {
	slug: "transactions",
	admin: {
		group: "Finances",
		useAsTitle: "description",
	},
	access: {
		read: () => true,
	},
	hooks: {
		afterChange: [updateBankAccount],
	},
	fields: [
		{
			name: "date",
			label: "Date",
			type: "date",
			required: true,
			admin: {
				date: {
					displayFormat: "M-dd-yyyy",
				},
				width: "47.5%",
			},
		},
		{
			name: "from",
			label: "From",
			admin: {
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
			type: "relationship",
			relationTo: ["accounts", "companies", "users"],
		},
		{
			name: "to",
			label: "To",
			admin: {
				width: "47.5%",
				style: {
					display: "inline-block",
				},
			},
			type: "relationship",
			relationTo: ["accounts", "companies", "users"],
		},
		{
			name: "description",
			label: "Description",
			type: "text",
			required: true,
			admin: {
				width: "75%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "amount",
			label: "Amount",
			type: "number",
			required: true,
			admin: {
				width: "20%",
				style: {
					display: "inline-block",
				},
			},
		},
		{
			name: "notes",
			label: "Notes",
			type: "textarea",
		},
	],
};
