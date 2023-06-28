"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import handleLogin from "./handleLogin";
import { UserContext } from "../../../components/Providers";

export default function Login() {
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const { user, setUser } = useContext(UserContext);

	useEffect(() => {
		if (user) {
			router.push("/employee/dashboard");
		} else {
			setTimeout(() => setLoading(false), 3000);
		}
	}, [user]);

	const login = async (formData) => {
		const { email, password } = Object.fromEntries(formData.entries());
		if (!email || !password) {
			// do a toast message saying email and password required
			return;
		}
		const results = await handleLogin(email, password);
		if (results.success) {
			setUser(results.user);
			router.push("/employee/dashboard");
		} else if (results.error) {
			//do a toast message saying the results.error
		}
	};

	return (
		<>
			{!loading && (
				<div className="absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-1/2">
					<div className="bg-amber-300 py-4 px-6 rounded-md">
						<h1 className="text-2xl text-center">Employee Login</h1>
						<div className="pt-4">
							<form action={login}>
								<div>
									<div>Email: </div>
									<input
										type="text"
										className="leading-4 rounded-md w-80 px-2 py-1"
										name="email"
									/>
								</div>
								<div className="pt-4">
									<div>Password: </div>
									<input
										type="password"
										className="leading-4 rounded-md w-80 px-2 py-1"
										name="password"
									/>
								</div>
								<div className="pt-4 text-center">
									<input
										type="submit"
										value="Log In"
										className="bg-gray-800 text-neutral-100 py-1 px-3 rounded-md"
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
