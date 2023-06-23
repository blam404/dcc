import { CollectionConfig } from "payload/types";

export const Companies: CollectionConfig = {
	slug: "companies",
	admin: {
		disableDuplicate: true,
		useAsTitle: "companyName",
		group: "Contacts",
		description: "Companies we've worked with or want to work with",
		listSearchableFields: ["contacts", "companyName"],
	},
	access: {
		create: ({ req: { user } }) => {
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles);
		},
		read: ({ req: { user } }) => {
			const allowed = ["admin", "editor", "employee"];
			return allowed.includes(user.roles);
		},
		update: ({ req: { user } }) => {
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles);
		},
		delete: ({ req: { user } }) => user.roles === "admin",
	},
	fields: [
		{
			name: "companyName",
			label: "Company Name",
			type: "text",
		},
		{
			name: "bankAccount",
			label: "Bank Account #",
			type: "text",
		},
		{
			name: "notes",
			label: "Notes",
			type: "textarea",
		},
		{
			name: "contacts",
			type: "blocks",
			admin: {
				initCollapsed: true,
			},
			blocks: [
				{
					slug: "contact",
					fields: [
						{
							name: "name",
							label: "Contact Name",
							type: "text",
						},
						{
							name: "phoneNumber",
							label: "Phone Number",
							type: "text",
						},
						{
							name: "discord",
							label: "Discord",
							type: "text",
						},
					],
				},
			],
		},
	],
};
