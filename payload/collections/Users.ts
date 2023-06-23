import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		disableDuplicate: true,
		useAsTitle: "characterName",
		group: "Contacts",
		description: "List of users on this site",
		listSearchableFields: ["email", "characterName", "discord"],
	},
	auth: {
		tokenExpiration: 14400,
		verify: false,
		maxLoginAttempts: 5,
		lockTime: 600 * 1000, //this is in milliseconds which is why it"s x1000
	},
	access: {
		create: ({ req: { user } }) => {
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles);
		},
		read: ({ req: { user } }) => {
			const recordIsUser = {
				id: {
					equals: user.id,
				},
			};
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles) || recordIsUser;
		},
		update: ({ id, req: { user } }) => {
			const recordIsUser = user.id === id;
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles) || recordIsUser;
		},
		delete: ({ req: { user } }) => user.roles === "admin",
		admin: ({ req: { user } }) => {
			const allowed = ["admin", "editor", "employee"];
			return allowed.includes(user.roles);
		},
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
			type: "select",
			options: [
				{
					label: "Admin",
					value: "admin",
				},
				{
					label: "Editor",
					value: "editor",
				},
				{
					label: "Employee",
					value: "employee",
				},
				{
					label: "User",
					value: "user",
				},
			],
		},
		{
			name: "timezone",
			label: "Time Zone",
			type: "text",
		},
	],
};
