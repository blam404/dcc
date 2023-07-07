import { CollectionConfig } from "payload/types";
import { addStartBalance } from "./hooks/accountHooks";

export const Accounts: CollectionConfig = {
	slug: "accounts",
	admin: {
		disableDuplicate: true,
		useAsTitle: "accountName",
		group: "Finances",
		description: "Company-owned bank accounts",
	},
	access: {
		create: ({ req: { user } }) => {
			const allowed = ["admin", "editor"];
			return allowed.includes(user?.roles);
		},
		read: ({ req: { user } }) => {
			const allowed = ["admin", "editor", "employee"];
			return allowed.includes(user?.roles);
		},
		update: ({ req: { user } }) => {
			const allowed = ["admin", "editor"];
			return allowed.includes(user?.roles);
		},
		delete: ({ req: { user } }) => user?.roles === "admin",
	},
	hooks: {
		beforeChange: [addStartBalance],
	},
	fields: [
		{
			name: "accountName",
			label: "Account Name",
			type: "text",
			required: true,
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
			access: {
				read: ({ req: { user } }) => {
					const allowed = ["admin", "editor"];
					return allowed.includes(user?.roles);
				},
			},
		},
		{
			name: "startingBalance",
			label: "Starting Balance",
			type: "number",
			admin: {
				hidden: true,
			},
		},
	],
};
