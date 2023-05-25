import { CollectionConfig } from "payload/types";

export const Documentation: CollectionConfig = {
	slug: "documentation",
	admin: {
		useAsTitle: "title",
	},
	access: {
		read: () => true,
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
