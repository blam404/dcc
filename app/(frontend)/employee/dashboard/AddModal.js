"use client";

import React, { useContext, useEffect, useState } from "react";
import { Modal, useModal } from "@faceless-ui/modal";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import { UserContext } from "../../../../components/Providers";
import getRecords from "../../../../utils/getRecords";
import createTransaction from "../dashboard/createTransaction";

import "./style.scss";

const transactionTypes = [
	{
		label: "Donation",
		value: "donation",
	},
	{
		label: "Expense",
		value: "expense",
	},
	{
		label: "Revenue",
		value: "revenue",
	},
];

const revenueType = [
	{
		label: "Taxi Service",
		value: "taxi",
	},
	{
		label: "Limousine Service",
		value: "limo",
	},
	{
		label: "City Tour",
		value: "city",
	},
	{
		label: "Gang Tour",
		value: "gang",
	},
	{
		label: "Helicopter Tour",
		value: "helicopter",
	},
	{
		label: "Submarine Tour",
		value: "submarine",
	},
];

const donationType = [
	{
		label: "Cash Cab",
		value: "cashCab",
	},
	{
		label: "General",
		value: "general",
	},
];

const expenseType = [
	{
		label: "Cash Cab",
		value: "cashCab",
	},
	{
		label: "Food/Drinks",
		value: "foodDrink",
	},
	{
		label: "Gas",
		value: "gas",
	},
	{
		label: "Payroll",
		value: "payroll",
	},
	{
		label: "Repairs",
		value: "repairs",
	},
	{
		label: "Other",
		value: "other",
	},
];

export default function AddModal({ transactions, setTransactions }) {
	const [date, setDate] = useState(new Date());
	const [transType, setTransType] = useState("");
	const [secondType, setSecondType] = useState(null);
	const [other, setOther] = useState(null);
	const [numPassenger, setNumPassenger] = useState("");
	const [from, setFrom] = useState(0);
	const [to, setTo] = useState(0);
	const [payment, setPayment] = useState(0);
	const [donation, setDonation] = useState(0);
	const [notes, setNotes] = useState("");
	const [vehicle, setVehicle] = useState(0);
	const [companyList, setCompanyList] = useState([]);
	const [accountList, setAccountList] = useState([]);
	const [vehicleList, setVehicleList] = useState([]);

	const { user } = useContext(UserContext);
	const { toggleModal } = useModal();

	//get all lists
	useEffect(() => {
		if (user) {
			const getAllList = async () => {
				const accounts = await getRecords(user, false, "accounts");
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
				const vehicles = await getRecords(user, false, "vehicles");
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
				const companies = await getRecords(user, false, "companies");
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
			if (other) setOther(null);
			const compIndex = companyList.findIndex(
				(company) => company.companyName === "Passenger"
			);
			setFrom(`company:${compIndex}`);
			const accIndex = accountList.findIndex(
				(account) => account.accountName === "Downtown Cab Co"
			);
			setTo(`account:${accIndex}`);
		} else if (transType === "donation") {
			if (other) setOther(null);
			if (vehicle) setVehicle(0);
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
				setVehicle(0);
			}
			if (secondType !== "other" && other) setOther(null);
		}
	}, [transType, secondType]);

	const resetFields = () => {
		setDate(new Date());
		setTransType("");
		setSecondType(null);
		setOther(null);
		setNumPassenger("");
		setFrom(0);
		setTo(0);
		setPayment(0);
		setDonation(0);
		setNotes("");
		setVehicle(0);
	};

	const handleTransType = (e) => {
		setTransType(e.target.value);
		if (secondType) {
			setSecondType(null);
		}
	};

	const handleSubmit = async () => {
		const fromInfo = from.split(":");
		const toInfo = to.split(":");

		let canSubmit =
			transType &&
			secondType &&
			(secondType !== "other" || (secondType === "other" && other)) &&
			from &&
			to &&
			payment >= 0 &&
			donation >= 0;

		if (canSubmit) {
			const getRelation = (info) => {
				switch (info[0]) {
					case "account":
						return {
							value: accountList[info[1]].id,
							relationTo: "accounts",
						};
					case "company":
						return {
							value: companyList[info[1]].id,
							relationTo: "companies",
						};
					case "vehicle":
						return {
							value: vehicleList[info[1]].id,
							relationTo: "vehicles",
						};
					case "user":
						return {
							value: user.id,
							relationTo: "users",
						};
				}
			};

			const results = await createTransaction(
				{
					date: format(date, "yyyy-MM-dd'T'kk:mm:ss.SSSXXX"),
					transactionType: transType,
					secondType,
					expenseOther: other,
					noOfPassenger: Number(numPassenger),
					paymentAmount: Number(payment),
					donationAmount: Number(donation),
					from: getRelation(fromInfo),
					to: getRelation(toInfo),
					notes: notes.length > 0 ? notes : null,
					vehicle: vehicle ? getRelation(vehicle.split(":")) : null,
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
				toggleModal("addTransaction");
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
		<Modal
			slug="addTransaction"
			className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[530px] h-[566px] p-4 rounded border border-amber-300"
		>
			<div>
				<div>
					<div>
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
							onChange={(e) => handleTransType(e)}
							value={transType}
						>
							<option disabled={transType} value={0}>
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
									defaultValue={0}
								>
									<option disabled value={0}>
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
										setNumPassenger(e.target.value);
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
								onChange={(e) => setSecondType(e.target.value)}
								defaultValue={0}
							>
								<option disabled value={0}>
									-- select an option --
								</option>
								{donationType.map((type) => (
									<option key={type.value} value={type.value}>
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
									defaultValue={0}
								>
									<option disabled value={0}>
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
					{transType && (
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
												setPayment(e.target.value)
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
												setDonation(e.target.value)
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
										<option disabled={from} value={0}>
											-- select an option --
										</option>
										{accountList.map((account, index) => (
											<option
												key={account.id}
												value={`account:${index}`}
											>
												{account.accountName}
											</option>
										))}
										{companyList.map((company, index) => (
											<option
												key={company.id}
												value={`company:${index}`}
											>
												{company.companyName}
											</option>
										))}
										<option value={"user"}>
											{user.characterName}
										</option>
									</select>
								</div>
								<div className="w-1/2">
									<div>To:</div>
									<select
										onChange={(e) => setTo(e.target.value)}
										value={to}
									>
										<option disabled={to} value={0}>
											-- select an option --
										</option>
										{accountList.map((account, index) => (
											<option
												key={account.id}
												value={`account:${index}`}
											>
												{account.accountName}
											</option>
										))}
										{companyList.map((company, index) => (
											<option
												key={company.id}
												value={`company:${index}`}
											>
												{company.companyName}
											</option>
										))}
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
										<option value={0}>None</option>
										{vehicleList.map((vehicle, index) => (
											<option
												key={vehicle.id}
												value={`vehicle:${index}`}
											>
												{vehicle.combinedName}
											</option>
										))}
									</select>
								</div>
							)}
							<div className="flex justify-center mt-4">
								<button
									className="px-2 py-1 rounded-md bg-amber-300"
									onClick={handleSubmit}
								>
									Submit
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</Modal>
	);
}
