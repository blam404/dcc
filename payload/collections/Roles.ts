import { CollectionConfig } from "payload/types";

import { isAdmin, isAdminFieldLevel } from "../accessControl/isAdmin";
import {
	isAdminOrSelf,
	isAdminOrSelfFieldLevel,
} from "../accessControl/isAdminOrSelf";

export const Roles: CollectionConfig = {
	slug: "roles",
	admin: {
		hidden: true,
		useAsTitle: "role",
	},
	fields: [
		{
			name: "role",
			label: "Role",
			type: "text",
		},
	],
};
