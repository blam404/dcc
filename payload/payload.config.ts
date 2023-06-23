import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import { Roles } from "./collections/Roles";
import { Documentation } from "./collections/Documentation";
import { Accounts } from "./collections/Accounts";
import { Companies } from "./collections/Companies";
import { Transactions } from "./collections/Transactions";
import { Vehicles } from "./collections/Vehicles";

export default buildConfig({
	admin: {
		user: "users",
	},
	collections: [
		Accounts,
		Companies,
		Documentation,
		Roles,
		Transactions,
		Users,
		Vehicles,
	],
	globals: [
		// Your globals here
	],
	typescript: {
		outputFile: path.resolve(__dirname, "../payload-types.ts"),
	},
});
