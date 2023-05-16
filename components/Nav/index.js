"use client";

import React from "react";
import { useJumplist } from "@faceless-ui/jumplist";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Nav() {
	const { scrollToID } = useJumplist();
	const router = useRouter();
	const pathname = usePathname();

	const handleNavClick = (location) => {
		if (pathname !== "/") {
			router.push("/");
		} else {
			scrollToID(location);
		}
	};

	return (
		<nav className="fixed top-0 flex justify-center w-full bg-slate-700 shadow-md z-10">
			<div className="container flex justify-between items-center py-2 relative">
				<Link href="/">
					<div className="logo text-amber-300 text-sm text-center">
						E&nbsp;&nbsp;&nbsp;R&nbsp;&nbsp;&nbsp;P
						<br />
						RECORDINGS
					</div>
				</Link>
				<div className="flex text-neutral-50">
					<button
						className="p-2 mx-2"
						onClick={() => {
							handleNavClick("latest");
						}}
					>
						Latest
					</button>
					<button
						className="p-2 mx-2"
						onClick={() => {
							handleNavClick("about");
						}}
					>
						About Us
					</button>
					<button
						className="p-2 ml-2"
						onClick={() => {
							handleNavClick("artists");
						}}
					>
						Artists
					</button>
				</div>
			</div>
		</nav>
	);
}
