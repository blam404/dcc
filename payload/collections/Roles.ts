import { CollectionConfig } from "payload/types";

import { isAdmin, isAdminFieldLevel } from "../accessControl/isAdmin";
import {
	isAdminOrSelf,
	isAdminOrSelfFieldLevel,
} from "../accessControl/isAdminOrSelf";

export const Roles: CollectionConfig = {
	slug: "roles",
	admin: {
		group: "Misc",
		useAsTitle: "role",
		description: "Roles for users",
	},
	access: {
		create: ({ req: { user } }) => user.roles === "admin",
		read: ({ req: { user } }) => user.roles === "admin",
		update: ({ req: { user } }) => user.roles === "admin",
		delete: ({ req: { user } }) => user.roles === "admin",
	},
	fields: [
		{
			name: "role",
			label: "Role",
			type: "text",
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
		},
	],
};
