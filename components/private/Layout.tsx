"use client";

import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";

import getRecords from "~utils/getRecords";
import handleLogOut from "~components/Nav/handleLogOut";
import { MenuContext, UserContext } from "~components/Providers";
import useMediaQuery, { breakpoint } from "~utils/useMediaQuery";

import { FaDigitalTachograph, FaUser } from "react-icons/fa";
import { PiBankFill } from "react-icons/pi";
import { BiSolidLogOut, BiSolidReport } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

import { Account } from "~types/Payload.types";
import { primaryColor } from "~utils/companySpecifics";

const gradientTransition =
	"bg-gradient-to-l from-neutral-100 to-primary-light from-50% to-50% transition-all bg-right-bottom hover:bg-left-bottom bg-[length:200%]";

export default function Layout({ children }) {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [showMenu, toggleMenu] = useState<boolean>(false);
	const { user } = useContext(UserContext);
	const { pageTitle } = useContext(MenuContext);
	const focusRef = useRef<HTMLHRElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		if (user) {
			if (["admin", "editor"].includes(user.roles)) {
				const getAccounts = async () => {
					const results = await getRecords(user, false, "accounts");
					if (results.success) {
						setAccounts(results.success);
					} else if (results.error) {
						toast.error(
							"Error retrieving bank account information. If this persists, contact the admin.",
							{
								toastId: "accountError",
							}
						);
						toast.error(`Error message: ${results.error}`, {
							toastId: "accountErrorMsg",
						});
					}
				};
				getAccounts();
			}
		}
	}, [user]);

	const Menu = () => (
		<>
			<div className="h-14">
				<Link href="/">
					<Image
						src="/images/dtccLogo.png"
						alt="Downtown Cab Co Logo"
						priority={true}
						width="0"
						height="0"
						sizes="100vw"
						className="w-36 mx-auto"
					/>
				</Link>
				<hr className="my-2 border-neutral-400" ref={focusRef} />
			</div>

			<div>
				<ul>
					<li
						className={gradientTransition}
						style={{
							background: pathname?.match("dashboard")
								? primaryColor.DEFAULT
								: "",
						}}
					>
						<Link href="/employee/dashboard">
							<div className="flex items-center p-2">
								<FaDigitalTachograph className="w-6 h-6 mr-2" />
								Dashboard
							</div>
						</Link>
					</li>
					{["admin", "editor"].includes(user.roles) && (
						<>
							<li>
								<div className="flex items-center p-2">
									<PiBankFill className="w-6 h-6 mr-2" />
									Accounts
								</div>
								<div>
									{accounts.map((account) => (
										<Link
											key={account.id}
											href={`/employee/accounts/${account.id}`}
										>
											<div
												className={`ml-8 py-1 px-2 text-sm ${gradientTransition}`}
												style={{
													background: pathname?.match(
														account.id
													)
														? primaryColor.DEFAULT
														: "",
												}}
											>
												{account.accountName}
											</div>
										</Link>
									))}
								</div>
							</li>
							<li
								className={gradientTransition}
								style={{
									background: pathname?.match("reports")
										? "#fcd34d"
										: "",
								}}
							>
								<Link href="/employee/reports">
									<div className="flex items-center p-2">
										<BiSolidReport className="w-6 h-6 mr-2" />
										Reports
									</div>
								</Link>
							</li>
						</>
					)}
				</ul>
				<hr className="my-2 border-neutral-400" />
			</div>

			<div className="absolute bottom-0 left-0 w-full px-1">
				<ul>
					<li
						onClick={handleLogOut}
						className={`flex items-center p-2 cursor-pointer ${gradientTransition}`}
					>
						<BiSolidLogOut className="w-6 h-6 mr-2" />
						Log Out
					</li>
					<Link href="/employee/profile">
						<li
							className={`flex items-center p-2 ${gradientTransition}`}
						>
							<FaUser className="w-[1.4rem] h-[1.4rem] mr-1" />
							<div>
								<div>{user?.characterName}</div>
								<div className="text-sm text-neutral-400">
									{user?.email}
								</div>
							</div>
						</li>
					</Link>
				</ul>
			</div>
		</>
	);

	const lg = useMediaQuery(breakpoint.lg);

	if (user) {
		return (
			<div className="relative min-h-screen bg-neutral-100 grid grid-cols-12">
				{lg && (
					<div className="col-span-2 relative">
						<div className="fixed top-0 bottom-0 w-1/6 bg-neutral-100 py-2 px-1 shadow-lg border-r border-neutral-300">
							<Menu />
						</div>
					</div>
				)}
				{!lg && (
					<Transition show={showMenu} as={Fragment}>
						<Dialog
							initialFocus={focusRef}
							onClose={() => toggleMenu(false)}
						>
							<Transition.Child
								enter="transition-opacity ease-linear duration-200"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="transition-opacity ease-linear duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div
									className="fixed inset-0 bg-black/75"
									aria-hidden="true"
								/>
							</Transition.Child>
							<Transition.Child
								enter="transition-all ease-in-out duration-200 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition-all ease-in-out duration-200 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
								className="absolute top-0 bottom-0 sm:min-w-[40%] min-w-[50%] z-20"
								as="div"
							>
								<Dialog.Panel className="h-full bg-neutral-100 py-2 px-1 shadow-lg border-r border-neutral-300">
									<Menu />
								</Dialog.Panel>
							</Transition.Child>
						</Dialog>
					</Transition>
				)}
				<div className={"relative col-span-12 lg:col-span-10"}>
					<div className="fixed top-0 flex items-center w-full lg:w-5/6 h-16 bg-neutral-100 px-4 md:px-8 shadow-lg border-b border-neutral-300 text-xl z-10">
						{!lg && (
							<FiMenu
								className="w-6 h-6 mr-2 cursor-pointer"
								onClick={() => toggleMenu(!showMenu)}
							/>
						)}
						<strong>{pageTitle}</strong>
					</div>
					<div className="bg-primary-xlight min-h-screen pt-16">
						{children}
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
}
