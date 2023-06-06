import { CollectionConfig } from "payload/types";

import { isAdmin, isAdminFieldLevel } from "../accessControl/isAdmin";
import {
	isAdminOrSelf,
	isAdminOrSelfFieldLevel,
} from "../accessControl/isAdminOrSelf";

export const Users: CollectionConfig = {
	slug: "users",
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
			name: "title",
			label: "Title",
			type: "text",
		},
		{
			name: "phoneNumber",
			label: "Phone Number",
			type: "text",
		},
		{
			name: "bankAccount",
			label: "Bank Account #",
			type: "text",
		},
		{
			name: "discord",
			label: "Discord",
			type: "text",
		},
		{
			name: "fiveMID",
			label: "FiveM ID",
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
		{
			name: "timezone",
			label: "Time Zone",
			type: "text",
		},
	],
};
