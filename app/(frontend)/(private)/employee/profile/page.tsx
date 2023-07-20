"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

import { MenuContext, UserContext } from "~components/Providers";
import { ContainerWrapper, ContainerBox } from "~components/Container";
import updateProfile from "./updateProfile";

import { FaSpinner } from "react-icons/fa";

import "../../style.scss";
import Button from "~components/Button";

export default function Profile() {
	const [characterName, setCharacterName] = useState("");
	const [bankAccount, setBankAccount] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [discord, setDiscord] = useState("");
	const [timezone, setTimezone] = useState("");
	const [pending, startTransition] = useTransition();

	const { user, setUser } = useContext(UserContext);
	const { setPageTitle } = useContext(MenuContext);

	useEffect(() => {
		setPageTitle("Profile)");
	}, []);

	useEffect(() => {
		if (user) {
			setCharacterName(user.characterName);
			setBankAccount(user.bankAccount);
			setPhoneNumber(user.phoneNumber);
			setDiscord(user.discord);
			setTimezone(user.timezone);
		}
	}, [user]);

	const handleUpdate = async () => {
		if (!characterName) {
			toast.error("Your name cannot be blank", {
				toastId: "blankName",
			});
			return;
		}

		const results = await updateProfile(
			{ characterName, bankAccount, phoneNumber, discord, timezone },
			user
		);

		if (results.success) {
			setUser(results.user);
			toast.success("Profile has been updated.", {
				toastId: "updateSuccess",
			});
		} else if (results.error) {
			toast.error(
				"Error updating profile. Try again or contact the admin if the problem persists",
				{
					toastId: "updateError",
				}
			);
			toast.error(`Error message: ${results.error}`, {
				toastId: "errorMessage",
			});
		}
	};

	const canUpdate = () => {
		return (
			characterName !== user.characterName ||
			bankAccount !== user.bankAccount ||
			phoneNumber !== user.phoneNumber ||
			discord !== user.discord ||
			timezone !== user.timezone
		);
	};

	return (
		<>
			{!user && (
				<div className="absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-1/2">
					<FaSpinner className="animate-spin h-12 w-12" />
				</div>
			)}
			{user && (
				<div className="container mx-auto py-8 px-4 md:px-8">
					<h1 className="text-center text-2xl font-bold">
						{user.characterName}
					</h1>
					<ContainerWrapper col={1} className="pt-2">
						<ContainerBox>
							<div className="pt-4 justify-center flex">
								<form>
									<div>
										<div>Name</div>
										<input
											type="text"
											className="leading-4 rounded-md w-80 px-2 py-1"
											value={characterName}
											onChange={(e) => {
												setCharacterName(
													e.target.value
												);
											}}
										/>
									</div>
									<div>
										<div>Phone Number</div>
										<input
											type="text"
											className="leading-4 rounded-md w-80 px-2 py-1"
											value={phoneNumber}
											onChange={(e) => {
												setPhoneNumber(e.target.value);
											}}
										/>
									</div>
									<div>
										<div>Discord</div>
										<input
											type="text"
											className="leading-4 rounded-md w-80 px-2 py-1"
											value={discord}
											onChange={(e) => {
												setDiscord(e.target.value);
											}}
										/>
									</div>
									<div>
										<div>Time Zone</div>
										<input
											type="text"
											className="leading-4 rounded-md w-80 px-2 py-1"
											value={timezone}
											onChange={(e) => {
												setTimezone(e.target.value);
											}}
										/>
									</div>
									<div>
										<div>Bank Account</div>
										<input
											type="text"
											className="leading-4 rounded-md w-80 px-2 py-1"
											value={bankAccount}
											onChange={(e) => {
												setBankAccount(e.target.value);
											}}
										/>
									</div>
									<div className="pt-4 text-center">
										<Button
											onClick={async () => {
												startTransition(handleUpdate);
											}}
											disabled={pending || !canUpdate()}
										>
											{pending ? (
												<FaSpinner className="animate-spin h-6 w-6" />
											) : (
												"Update"
											)}
										</Button>
									</div>
								</form>
							</div>
						</ContainerBox>
					</ContainerWrapper>
				</div>
			)}
		</>
	);
}
