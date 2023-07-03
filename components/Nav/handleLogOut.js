"use server";

import { cookies } from "next/headers";

const handleLogOut = () => {
	cookies().set({
		name: "payload-token",
		value: null,
	});
};

export default handleLogOut;
