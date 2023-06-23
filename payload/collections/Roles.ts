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
