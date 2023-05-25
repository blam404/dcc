"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
	return (
		<nav className="fixed top-0 flex justify-center w-full bg-amber-300 shadow-md z-10">
			<div className="container flex justify-center items-center py-2 relative">
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
		</nav>
	);
}
