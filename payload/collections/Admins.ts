import { CollectionConfig } from "payload/types";

import { isAdmin, isAdminFieldLevel } from "../accessControl/isAdmin";
import {
	isAdminOrSelf,
	isAdminOrSelfFieldLevel,
} from "../accessControl/isAdminOrSelf";

export const Users: CollectionConfig = {
	slug: "admins",
	admin: {
		disableDuplicate: true,
		useAsTitle: "characterName",
		group: "Contacts",
	},
	auth: {
		tokenExpiration: 14400,
		verify: false,
		maxLoginAttempts: 5,
		lockTime: 600 * 1000, //this is in milliseconds which is why it"s x1000
	},
	fields: [
		{
			name: "email",
			label: "Email",
			type: "text",
			unique: true,
		},
		{
			name: "characterName",
			label: "Character Name",
			type: "text",
		},
		{
			name: "roles",
			type: "relationship",
			relationTo: ["roles"],
			hasMany: true,
			admin: {
				isSortable: true,
				allowCreate: false,
			},
		},
	],
};
