"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../Providers";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

import handleLogOut from "../../utils/handleLogOut";

export default function Nav() {
	const { user, setUser } = useContext(UserContext);
	const router = useRouter();

	const [showMenu, setShowMenu] = useState(false);
	const logOut = async () => {
		await handleLogOut();
		router.push("/");
		setTimeout(() => {
			setUser(null);
		}, 100);
	};
	return (
		<nav className="fixed top-0 w-full bg-amber-300 shadow-md z-10">
			<div className="container mx-auto flex justify-between items-center py-2">
				<div></div>
				<div>
					<Link href="/">
						<Image
							src="/images/dtccLogo.png"
							alt="Downtown Cab Co Logo"
							priority={true}
							width="0"
							height="0"
							sizes="100vw"
							className="w-44"
						/>
					</Link>
				</div>
				<div className="pr-4 relative">
					<FaUserCircle
						className="rounded-full bg-amber-300  text-amber-100 h-10 w-10"
						onClick={() => {
							setShowMenu(!showMenu);
						}}
					/>

					<div
						className="bg-white rounded-md w-max text-center absolute right-4 "
						style={{
							display: showMenu ? "block" : "none",
						}}
						onClick={() => {
							setShowMenu(!showMenu);
						}}
					>
						<div className="py-1 px-2 hover:bg-amber-100">
							<Link
								href={user ? "/employee/dashboard" : "/login"}
							>
								{user ? "Dashboard" : "Log In"}
							</Link>
						</div>
						{user && (
							<div className="py-1 px-2 hover:bg-amber-100">
								<button onClick={logOut}>Log Out</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
