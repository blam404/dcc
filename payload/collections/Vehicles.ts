import { CollectionConfig } from "payload/types";
import { combinedName } from "./hooks/vehicleHooks";

export const Vehicles: CollectionConfig = {
	slug: "vehicles",
	admin: {
		useAsTitle: "combinedName",
		group: "Assets",
		description: "Vehicles owned by the company",
		listSearchableFields: ["vechicle", "licensePlate"],
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
