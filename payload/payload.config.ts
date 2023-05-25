import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import { Roles } from "./collections/Roles";
import { Documentation } from "./collections/Documentation";

export default buildConfig({
	admin: {
		user: "users",
	},
	collections: [Users, Roles, Documentation],
	globals: [
		// Your globals here
	],
	typescript: {
		outputFile: path.resolve(__dirname, "../payload-types.ts"),
	},
});
