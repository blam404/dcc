import { CollectionBeforeChangeHook, CollectionConfig } from "payload/types";

const combinedName: CollectionBeforeChangeHook = async ({ data }) => {
	if (!data.combinedName) {
		data.combinedName = `${data.vehicle} - ${data.licensePlate}`;
	}
	return data;
};

export const Vehicles: CollectionConfig = {
	slug: "vehicles",
	admin: {
		group: "Assets",
		useAsTitle: "combinedName",
	},
	access: {
		read: () => true,
	},
	hooks: {
		beforeChange: [combinedName],
	},
	fields: [
		{
			name: "vehicle",
			label: "Vehicle Type",
			type: "text",
			required: true,
			admin: {
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "licensePlate",
			label: "License Plate",
			type: "text",
			required: true,
			admin: {
				width: "47.5%",
				style: {
					display: "inline-block",
				},
			},
		},
		{
			name: "combinedName",
			label: "Vehicle - License",
			type: "text",
			admin: {
				hidden: true,
			},
		},
	],
};
