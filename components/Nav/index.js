"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../Providers";

export default function Nav() {
	const { user } = useContext(UserContext);
	return (
		<nav className="fixed top-0 w-full bg-amber-300 shadow-md z-10">
			<div className="container mx-auto flex justify-between items-center py-2">
				<div></div>
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
				<Link href="/login">
					<button className="bg-neutral-800 text-neutral-100 py-1 px-3 rounded-md">
						{user ? "Dashboard" : "Log In"}
					</button>
				</Link>
			</div>
		</nav>
	);
}
