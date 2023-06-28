import { CollectionConfig } from "payload/types";

export const Documentation: CollectionConfig = {
	slug: "documentation",
	admin: {
		disableDuplicate: true,
		useAsTitle: "title",
		group: "Misc",
		description: "Company policies and things you need to know",
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
	fields: [
		{
			name: "title",
			label: "Title",
			type: "text",
		},
		{
			name: "sections",
			type: "blocks",
			admin: {
				initCollapsed: true,
			},
			blocks: [
				{
					slug: "section",
					fields: [
						{
							name: "sectionContent",
							label: "Content",
							type: "richText",
						},
					],
				},
			],
		},
	],
};
