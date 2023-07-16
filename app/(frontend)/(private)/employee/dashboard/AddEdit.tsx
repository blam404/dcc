"use client";

import React, {
	Fragment,
	useContext,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import { UserContext } from "~components/Providers";
import getRecords from "~utils/getRecords";
import createUpdate from "./createUpdate";
import {
	transactionTypes,
	revenueType,
	donationType,
	expenseType,
} from "~utils/companySpecifics";

import { Account, Vehicle, Company } from "~types/Payload.types";

import { FaSpinner } from "react-icons/fa";

import "./style.scss";

export default function AddEdit({
	transactions,
	setTransactions,
	editing,
	isOpen,
	setIsOpen,
}) {
	const [pending, startTransition] = useTransition();
	const [date, setDate] = useState<Date>(new Date());
	const [transType, setTransType] = useState<string>("0");
	const [secondType, setSecondType] = useState<string>("0");
	const [other, setOther] = useState<string>("");
	const [numPassenger, setNumPassenger] = useState<number | "">("");
	const [from, setFrom] = useState<string>("0");
	const [to, setTo] = useState<string>("0");
	const [payment, setPayment] = useState<number>(0);
	const [donation, setDonation] = useState<number>(0);
	const [notes, setNotes] = useState<string>("");
	const [vehicle, setVehicle] = useState<string>("0");
	const [companyList, setCompanyList] = useState<Company[]>([]);
	const [accountList, setAccountList] = useState<Account[]>([]);
	const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);

	const focusRef = useRef<HTMLSelectElement>(null);

	const { user } = useContext(UserContext);

	//get all lists
	useEffect(() => {
		if (user) {
			const getAllList = async () => {
				const accounts = await getRecords(
					user,
					false,
					"accounts",
					0,
					false
				);
				if (accounts.success) {
					setAccountList(accounts.success);
				} else if (accounts.error) {
					toast.error(
						"There was an error contacting the database. Try again or contact the admin if the problem persists.",
						{
							toastId: "accountGetRecords.",
						}
					);
				}
				const vehicles = await getRecords(
					user,
					false,
					"vehicles",
					0,
					false
				);
				if (vehicles.success) {
					setVehicleList(vehicles.success);
				} else if (vehicles.error) {
					toast.error(
						"There was an error contacting the database. Try again or contact the admin if the problem persists.",
						{
							toastId: "vehicleGetRecords.",
						}
					);
				}
				const companies = await getRecords(
					user,
					false,
					"companies",
					0,
					false
				);
				if (companies.success) {
					setCompanyList(companies.success);
				} else if (companies.error) {
					toast.error(
						"There was an error contacting the database. Try again or contact the admin if the problem persists.",
						{
							toastId: "companiesGetRecords.",
						}
					);
				}
			};
			getAllList();
		}
	}, [user]);

	//auto fills the from and to field and resets some values
	useEffect(() => {
		if (transType === "revenue") {
			if (other) setOther("");
			const compIndex = companyList.findIndex(
				(company) => company.companyName === "Passenger"
			);
			setFrom(`company:${compIndex}`);
			const accIndex = accountList.findIndex(
				(account) => account.accountName === "Downtown Cab Co"
			);
			setTo(`account:${accIndex}`);
		} else if (transType === "donation") {
			if (other) setOther("");
			if (vehicle) setVehicle("0");
			if (payment) setPayment(0);
			const compIndex = companyList.findIndex(
				(company) => company.companyName === "Donor"
			);
			setFrom(`company:${compIndex}`);
			if (secondType === "general") {
				const accIndex = accountList.findIndex(
					(account) => account.accountName === "Downtown Cab Co"
				);
				setTo(`account:${accIndex}`);
			} else if (secondType === "cashCab") {
				const accIndex = accountList.findIndex(
					(account) => account.accountName === "Cash Cab Account"
				);
				setTo(`account:${accIndex}`);
			}
		} else if (transType === "expense") {
			if (donation) setDonation(0);
			if (secondType === "cashCab") {
				const accIndex = accountList.findIndex(
					(account) => account.accountName === "Cash Cab Account"
				);
				setFrom(`account:${accIndex}`);
				const compIndex = companyList.findIndex(
					(company) => company.companyName === "Passenger"
				);
				setTo(`company:${compIndex}`);
			} else {
				const accIndex = accountList.findIndex(
					(account) => account.accountName === "Downtown Cab Co"
				);
				setFrom(`account:${accIndex}`);
				setTo("user");
			}
			if (!["gas", "repairs"].includes(secondType) && vehicle) {
				setVehicle("0");
			}
			if (secondType !== "other" && other) setOther("");
		}
	}, [transType, secondType]);

	useEffect(() => {
		if (editing) {
			setDate(new Date(editing.date));
			setTransType(editing.transactionType);
			setSecondType(
				editing.revenueType ||
					editing.donationType ||
					editing.expenseType
			);
			setOther(editing.expenseOther);
			setNumPassenger(editing.noOfPassenger);
			setPayment(editing.paymentAmount);
			setDonation(editing.donationAmount);
			setNotes(editing.notes || "");

			if (editing.vehicle) {
				const vehicleIndex = vehicleList.findIndex(
					(vehicle) => vehicle.id === editing.vehicle.value.id
				);
				setVehicle(`vehicle:${vehicleIndex}`);
			}
			if (editing.from.relationTo === "accounts") {
				const fromIndex = accountList.findIndex(
					(account) => account.id === editing.from.value.id
				);
				setFrom(`account:${fromIndex}`);
			} else if (editing.from.relationTo === "companies") {
				const fromIndex = companyList.findIndex(
					(company) => company.id === editing.from.value.id
				);
				setFrom(`company:${fromIndex}`);
			} else if (editing.from.relationTo === "user") {
				setFrom("user");
			}

			if (editing.to.relationTo === "accounts") {
				const toIndex = accountList.findIndex(
					(account) => account.id === editing.to.value.id
				);
				setTo(`account:${toIndex}`);
			} else if (editing.to.relationTo === "companies") {
				const toIndex = companyList.findIndex(
					(company) => company.id === editing.from.value.id
				);
				setTo(`company:${toIndex}`);
			} else if (editing.to.relationTo === "user") {
				setTo("user");
			}
		} else {
			resetFields();
		}
	}, [editing]);

	const resetFields = () => {
		setDate(new Date());
		setTransType("0");
		setSecondType("0");
		setOther("");
		setNumPassenger("");
		setFrom("0");
		setTo("0");
		setPayment(0);
		setDonation(0);
		setNotes("");
		setVehicle("0");
	};

	const handleTransType = (e) => {
		setTransType(e.target.value);
		if (secondType) {
			setSecondType("0");
		}
	};

	const handleSubmit = async () => {
		const [fromType, fromIndex] = from.split(":");
		const [toType, toIndex] = to.split(":");
		const [vehicleType, vehicleIndex] = vehicle ? vehicle.split(":") : [];

		let canSubmit =
			transType !== "0" &&
			secondType &&
			(secondType !== "other" || (secondType === "other" && other)) &&
			from &&
			to &&
			payment >= 0 &&
			donation >= 0;

		const getRelation = (type, index) => {
			switch (type) {
				case "account":
					return {
						value: accountList[index].id,
						relationTo: "accounts",
					};
				case "company":
					return {
						value: companyList[index].id,
						relationTo: "companies",
					};
				case "vehicle":
					return {
						value: vehicleList[index].id,
						relationTo: "vehicles",
					};
				case "user":
					return {
						value: user.id,
						relationTo: "users",
					};
				default:
					return null;
			}
		};

		const results = await createUpdate(
			{
				id: editing?.id || null,
				date: format(date, "yyyy-MM-dd'T'kk:mm:ss.SSSXXX"),
				transactionType: transType,
				secondType,
				expenseOther: other,
				noOfPassenger: Number(numPassenger),
				paymentAmount: Number(payment),
				donationAmount: Number(donation),
				from: getRelation(fromType, fromIndex),
				to: getRelation(toType, toIndex),
				notes: notes.length > 0 ? notes : null,
				vehicle: getRelation(vehicleType, vehicleIndex),
				createdBy: {
					value: user.id,
					relationTo: "users",
				},
				updatedBy: {
					value: user.id,
					relationTo: "users",
				},
			},
			user
		);

		if (results.success) {
			resetFields();
			setIsOpen(false);
			results.success.createdBy = {
				value: {
					characterName: user.characterName,
				},
			};
			console.log("vehicleList: ", vehicleList);
			console.log("vehicle Index: ", vehicleIndex);
			if (vehicleIndex) {
				results.success.vehicle = vehicle
					? {
							relationTo: "vehicles",
							value: vehicleList[vehicleIndex],
					  }
					: null;
			}
		}

		if (canSubmit && editing) {
			if (results.success) {
				const updated = [...transactions];
				const transactionIndex = transactions.findIndex(
					(transaction) => transaction.id === editing.id
				);
				updated[transactionIndex] = results.success;
				setTransactions(updated);
				toast.success("Transaction successfully updated.", {
					toastId: "transactionSuccess",
				});
			} else if (results.error) {
				toast.error(
					"Error updating transaction. Try again or contact the admin if the problem persists",
					{
						toastId: "transactionError",
					}
				);
				toast.error(`Error message: ${results.error}`, {
					toastId: "errorMessage",
				});
			}
		} else if (canSubmit && !editing) {
			if (results.success) {
				const added = [results.success, ...transactions];
				// sorting in case transaction is back dated
				added.sort(
					(a, b) =>
						new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				if (added.length > 10) {
					added.splice(-1);
				}
				setTransactions(added);
				toast.success("Transaction successfully added.", {
					toastId: "transactionSuccess",
				});
			} else if (results.error) {
				toast.error(
					"Error adding transaction. Try again or contact the admin if the problem persists",
					{
						toastId: "transactionError",
					}
				);
				toast.error(`Error message: ${results.error}`, {
					toastId: "errorMessage",
				});
			}
		} else {
			toast.error("Some required fields are missing", {
				toastId: "addTransactionError",
			});
		}
	};

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog
				initialFocus={focusRef}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
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
					enterFrom="translate-y-full -translate-x-1/2"
					enterTo="-translate-y-1/2 -translate-x-1/2"
					leave="transition-all ease-in-out duration-200 transform"
					leaveFrom="-translate-y-1/2 -translate-x-1/2"
					leaveTo="translate-y-full -translate-x-1/2"
					className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				>
					<Dialog.Panel className=" w-[530px] h-[566px] p-4 rounded-md border border-amber-300 bg-white">
						<Dialog.Title>
							<strong>Add a Transaction</strong>
						</Dialog.Title>
						<div className="pt-2">
							<div>Date</div>
							<DatePicker
								selected={date}
								onChange={(date) => setDate(date)}
								dateFormat="LLL d y"
							/>
						</div>
						<div className="mt-2">
							<div>Type</div>
							<select
								ref={focusRef}
								onChange={(e) => handleTransType(e)}
								value={transType}
							>
								<option
									disabled={transType !== "0"}
									value={"0"}
								>
									-- select an option --
								</option>
								{transactionTypes.map((type) => (
									<option key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>
						</div>
						{transType === "revenue" && (
							<div className="flex mt-2">
								<div className="w-1/2 mr-4">
									<div>Revenue Type</div>
									<select
										onChange={(e) =>
											setSecondType(e.target.value)
										}
										value={secondType}
									>
										<option
											disabled={secondType !== "0"}
											value={"0"}
										>
											-- select an option --
										</option>
										{revenueType.map((type) => (
											<option
												key={type.value}
												value={type.value}
											>
												{type.label}
											</option>
										))}
									</select>
								</div>
								<div className="w-1/2">
									<div># of Passengers:</div>
									<input
										type="number"
										onChange={(e) => {
											setNumPassenger(
												e.target.valueAsNumber
											);
										}}
										value={numPassenger}
									/>
								</div>
							</div>
						)}
						{transType === "donation" && (
							<div className="mt-2">
								<div>Donation Type</div>
								<select
									onChange={(e) =>
										setSecondType(e.target.value)
									}
									value={secondType}
								>
									<option
										disabled={secondType !== "0"}
										value={"0"}
									>
										-- select an option --
									</option>
									{donationType.map((type) => (
										<option
											key={type.value}
											value={type.value}
										>
											{type.label}
										</option>
									))}
								</select>
							</div>
						)}
						{transType === "expense" && (
							<div className="flex mt-2">
								<div className="w-1/2 mr-4">
									<div>Expense Type</div>
									<select
										onChange={(e) =>
											setSecondType(e.target.value)
										}
										value={secondType}
									>
										<option
											disabled={secondType !== "0"}
											value={"0"}
										>
											-- select an option --
										</option>
										{expenseType.map((type) => (
											<option
												key={type.value}
												value={type.value}
											>
												{type.label}
											</option>
										))}
									</select>
								</div>
								{secondType === "other" && (
									<div className="w-1/2">
										<div>Other:</div>
										<input
											type="text"
											onChange={(e) => {
												setOther(e.target.value);
											}}
										/>
									</div>
								)}
							</div>
						)}
						{transType !== "0" && (
							<>
								<div className="flex mt-2">
									{(transType === "revenue" ||
										transType === "expense") && (
										<div className="w-1/2 mr-4">
											<div>Payment Amount:</div>
											<input
												type="number"
												value={payment}
												onChange={(e) =>
													setPayment(
														e.target.valueAsNumber
													)
												}
											/>
										</div>
									)}
									{(transType === "revenue" ||
										transType === "donation") && (
										<div className="w-1/2">
											<div>Donation Amount:</div>
											<input
												type="number"
												value={donation}
												onChange={(e) =>
													setDonation(
														e.target.valueAsNumber
													)
												}
											/>
										</div>
									)}
								</div>
								<div className="flex mt-2">
									<div className="w-1/2 mr-4">
										<div>From:</div>
										<select
											onChange={(e) =>
												setFrom(e.target.value)
											}
											value={from}
										>
											<option
												disabled={from !== "0"}
												value={"0"}
											>
												-- select an option --
											</option>
											{accountList.map(
												(account, index) => (
													<option
														key={account.id}
														value={`account:${index}`}
													>
														{account.accountName}
													</option>
												)
											)}
											{companyList.map(
												(company, index) => (
													<option
														key={company.id}
														value={`company:${index}`}
													>
														{company.companyName}
													</option>
												)
											)}
											<option value={"user"}>
												{user.characterName}
											</option>
										</select>
									</div>
									<div className="w-1/2">
										<div>To:</div>
										<select
											onChange={(e) =>
												setTo(e.target.value)
											}
											value={to}
										>
											<option
												disabled={to !== "0"}
												value={"0"}
											>
												-- select an option --
											</option>
											{accountList.map(
												(account, index) => (
													<option
														key={account.id}
														value={`account:${index}`}
													>
														{account.accountName}
													</option>
												)
											)}
											{companyList.map(
												(company, index) => (
													<option
														key={company.id}
														value={`company:${index}`}
													>
														{company.companyName}
													</option>
												)
											)}
											<option value={"user"}>
												{user.characterName}
											</option>
										</select>
									</div>
								</div>
								<div className="mt-2">
									<div>Notes</div>
									<textarea
										value={notes}
										onChange={(e) => {
											setNotes(e.target.value);
										}}
										className="w-full"
									/>
								</div>
								{(transType === "revenue" ||
									(transType === "expense" &&
										["gas", "repairs"].includes(
											secondType
										))) && (
									<div className="mt-2">
										<div>Vehicle Used</div>
										<select
											onChange={(e) =>
												setVehicle(e.target.value)
											}
											value={vehicle}
										>
											<option value={"0"}>None</option>
											{vehicleList.map(
												(vehicle, index) => (
													<option
														key={vehicle.id}
														value={`vehicle:${index}`}
													>
														{vehicle.combinedName}
													</option>
												)
											)}
										</select>
									</div>
								)}
								<div className="flex justify-center mt-4">
									<button
										className="px-2 py-1 rounded-md bg-amber-300"
										onClick={async () => {
											startTransition(handleSubmit);
										}}
										disabled={pending}
									>
										{pending ? (
											<FaSpinner className="animate-spin h-6 w-6" />
										) : editing ? (
											"Update"
										) : (
											"Submit"
										)}
									</button>
								</div>
							</>
						)}
					</Dialog.Panel>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
}
