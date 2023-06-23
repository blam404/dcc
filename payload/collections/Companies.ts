import { CollectionConfig } from "payload/types";

export const Companies: CollectionConfig = {
	slug: "companies",
	admin: {
		disableDuplicate: true,
		useAsTitle: "companyName",
		group: "Contacts",
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
