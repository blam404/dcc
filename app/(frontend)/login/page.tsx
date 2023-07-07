"use client";

import React, { useContext, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import handleLogin from "./handleLogin";
import { UserContext } from "../../../components/Providers";

import { FaSpinner } from "react-icons/fa";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, startTransition] = useTransition();
	const router = useRouter();
	const { setUser } = useContext(UserContext);

	const login = async () => {
		if (!email || !password) {
			toast.error("Email and password required", {
				toastId: "emailPassword",
			});
			return;
		}
		const results = await handleLogin(email, password);
		if (results.success) {
			setUser(results.user);
			router.push("/employee/dashboard");
		} else if (results.error) {
			toast.error("There was a problem logging in.", {
				toastId: "loginError",
			});
			toast.error(`Error message: ${results.error}`, {
				toastId: "errorMessage",
			});
		}
	};

	return (
		<div className="absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-1/2">
			<div className="bg-amber-300 py-4 px-6 rounded-md">
				<h1 className="text-2xl text-center">Employee Login</h1>
				<div className="pt-4">
					<form>
						<div>
							<div>Email: </div>
							<input
								type="text"
								className="leading-4 rounded-md w-80 px-2 py-1"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="pt-4">
							<div>Password: </div>
							<input
								type="password"
								className="leading-4 rounded-md w-80 px-2 py-1"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="pt-4 text-center">
							<button
								disabled={pending}
								className="bg-neutral-800 text-neutral-100 py-1 px-3 rounded-md hover:cursor-pointer"
								onClick={async () => {
									startTransition(() => login());
								}}
							>
								{pending ? (
									<FaSpinner className="animate-spin h-6 w-6" />
								) : (
									"Log In"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
