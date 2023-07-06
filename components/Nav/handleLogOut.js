"use server";

import { cookies } from "next/headers";

const handleLogOut = () => {
	cookies().set({
		name: "payload-token",
		value: null,
		maxAge: -1,
	});
	cookies().set({
		name: "payload-roles",
		value: null,
		maxAge: -1,
	});
};

export default handleLogOut;
