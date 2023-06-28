"use client";

import React, { createContext, useEffect, useState } from "react";
import { JumplistProvider } from "@faceless-ui/jumplist";
import { ModalProvider } from "@faceless-ui/modal";

import getUser from "../../utils/getUser";

export const UserContext = createContext();

export default function Providers({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (!user) {
			const checkUser = async () => {
				const loggedIn = await getUser();
				setUser(loggedIn);
			};
			checkUser();
		}
	}, [user]);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<ModalProvider transitTime={250}>
				<JumplistProvider
					threshold={0.5}
					rootMargin="-100px 0px 0px 0px"
					smoothScroll
				>
					{children}
				</JumplistProvider>
			</ModalProvider>
		</UserContext.Provider>
	);
}
