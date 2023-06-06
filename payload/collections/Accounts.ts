import { CollectionConfig } from "payload/types";

export const Accounts: CollectionConfig = {
	slug: "accounts",
	admin: {
		group: "Finances",
		useAsTitle: "accountName",
	},
	access: {
		read: () => true,
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
	],
};
