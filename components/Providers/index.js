"use client";

import React, { createContext, useEffect, useState } from "react";
import { JumplistProvider } from "@faceless-ui/jumplist";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import getUser from "~utils/getUser";

export const UserContext = createContext();
export const MenuContext = createContext();

export default function Providers({ children }) {
	const [user, setUser] = useState(null);
	const [pageTitle, setPageTitle] = useState("");

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
			<MenuContext.Provider value={{ pageTitle, setPageTitle }}>
				<JumplistProvider
					threshold={0.5}
					rootMargin="-100px 0px 0px 0px"
					smoothScroll
				>
					<ToastContainer
						autoClose={2500}
						closeOnClick
						draggable
						hideProgressBar={true}
						newestOnTop={false}
						pauseOnFocusLoss={false}
						pauseOnHover={false}
						position="bottom-center"
						rtl={false}
						theme="light"
					/>
					{children}
				</JumplistProvider>
			</MenuContext.Provider>
		</UserContext.Provider>
	);
}
