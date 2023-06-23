import { CollectionBeforeChangeHook, CollectionConfig } from "payload/types";

const addStartBalance: CollectionBeforeChangeHook = async ({ data }) => {
	if (!data.startingBalance) {
		data.startingBalance = data.balance;
	}
	return data;
};

export const Accounts: CollectionConfig = {
	slug: "accounts",
	admin: {
		group: "Finances",
		useAsTitle: "accountName",
	},
	access: {
		read: () => true,
	},
	hooks: {
		beforeChange: [addStartBalance],
	},
	fields: [
		{
			name: "accountName",
			label: "Account Name",
			type: "text",
		},
		{
			name: "accountNumber",
			label: "Account Number",
			type: "text",
		},
		{
			name: "balance",
			label: "Balance",
			type: "number",
			required: true,
		},
		{
			name: "startingBalance",
			label: "Starting Balance",
			type: "number",
		},
	],
};
