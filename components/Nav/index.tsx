"use client";

import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";

import { UserContext } from "../Providers";
import handleLogOut from "./handleLogOut";

import { FaUserCircle } from "react-icons/fa";

export default function Nav() {
	const { user, setUser } = useContext(UserContext);
	const router = useRouter();

	const logOut = () => {
		handleLogOut();
		router.push("/");
		setUser(null);
	};
	return (
		<nav className="fixed top-0 w-full bg-primary shadow-md z-10">
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
				<Menu as="div" className="pr-4 relative">
					{({ close }) => (
						<>
							<Menu.Button>
								<FaUserCircle className="rounded-full bg-primary  text-white h-10 w-10" />
							</Menu.Button>
							<Transition
								enter="transition duration-200 ease-out origin-top-right"
								enterFrom="transform scale-50 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-200 ease-out origin-top-right"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-50 opacity-0"
							>
								<Menu.Items
									as="ul"
									className="bg-white rounded-md w-max text-center absolute right-0 min-w-[72px]"
								>
									{!user && (
										<Link href="/login">
											<Menu.Item
												as="li"
												className="py-1 px-2 hover:bg-primary-light cursor-pointer rounded-md"
												onClick={close}
											>
												Log In
											</Menu.Item>
										</Link>
									)}
									{user && (
										<>
											<Link href="/employee/dashboard">
												<Menu.Item
													as="li"
													className="py-1 px-2 hover:bg-primary-light cursor-pointer rounded-t-md"
													onClick={close}
												>
													Dashboard
												</Menu.Item>
											</Link>
											<Link href="/employee/profile">
												<Menu.Item
													as="li"
													className="py-1 px-2 hover:bg-primary-light cursor-pointer"
													onClick={close}
												>
													Profile
												</Menu.Item>
											</Link>
											<Menu.Item
												as="li"
												className="py-1 px-2 hover:bg-primary-light cursor-pointer rounded-b-md"
												onClick={() => {
													logOut();
													close();
												}}
											>
												Log Out
											</Menu.Item>
										</>
									)}
								</Menu.Items>
							</Transition>
						</>
					)}
				</Menu>
			</div>
		</nav>
	);
}
