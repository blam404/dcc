"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Modal, ModalToggler } from "@faceless-ui/modal";
import { toast } from "react-toastify";

import capFirstLetter from "../../../../utils/capFirstLetter";
import getRecords from "../../../../utils/getRecords";
import { UserContext } from "../../../../components/Providers";
import AddModal from "./AddModal";

import { FaPen, FaSearch, FaPlus, FaSpinner } from "react-icons/fa";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const [error, setError] = useState(false);

	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			const findTransactions = async () => {
				const results = await getRecords(user, false, "transactions");
				if (results.success) {
					setTransactions(results.success);
					setLoading(false);
				} else if (results.error) {
					setLoading(false);
					toast.error(
						"Error retrieving previous transactions. If this persists, contact the admin.",
						{
							toastId: "prevTransError",
						}
					);
					toast.error(`Error message: ${results.error}`, {
						toastId: "prevTransErrorMsg",
					});
				}
			};
			findTransactions();
		} else {
			router.push("/login");
		}
	}, [user]);

	const parseType = (transaction) => {
		const type =
			transaction.revenueType ||
			transaction.expenseType ||
			transaction.donationType;

		switch (type) {
			case "gas":
				return "Gas";
			case "cashCab":
				return "Cash Cab";
			case "taxi":
				return "Taxi Service";
			case "general":
				return "General";
			case "limo":
				return "Limo Service";
			case "city":
				return "City Tour";
			case "gang":
				return "Gang Tour";
			case "helicoptor":
				return "Helicoptor Tour";
			case "submarine":
				return "Submarine Tour";
			case "foodDrink":
				return "Food/Drinks";
			case "payroll":
				return "Payroll";
			case "repairs":
				return "Repairs";
			case "other":
				return transaction.expenseOther;
		}
	};
	return (
		<>
			{loading && (
				<div className="absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-1/2">
					<FaSpinner className="animate-spin h-12 w-12" />
				</div>
			)}
			{!loading && (
				<div className="container mx-auto">
					<h1 className="text-center text-xl">
						<strong>Last 10 Transactions</strong>
					</h1>
					{/* {["admin", "editor"].includes(user.roles) && (
						<div>
							<button className="rounded bg-amber-300 mr-4 py-1 px-2">
								Transaction View
							</button>
							<button className="rounded bg-amber-300 py-1 px-2">
								Account View
							</button>
						</div>
					)} */}
					<ul className="pt-4">
						<li className="flex flex-wrap rounded-md items-center py-2 px-4 bg-amber-300">
							<div className="w-1/12">
								<strong>Date</strong>
							</div>
							<div className="w-3/12">
								<strong>Type</strong>
							</div>
							<div className="w-1/12">
								<strong>Amount</strong>
							</div>
							<div className="w-3/12">
								<strong>Vehicle</strong>
							</div>
							<div className="w-3/12">
								<strong>Notes</strong>
							</div>
							<div className="w-1/12 flex justify-center">
								<ModalToggler
									slug="addTransaction"
									className="py-1 px-2 bg-amber-100 rounded"
								>
									<FaPlus />
								</ModalToggler>
							</div>
						</li>
						{transactions.length === 0 && (
							<li className="flex justify-center my-4">
								There aren&apos;t any previous transactions.
							</li>
						)}
						{transactions.length > 0 &&
							transactions.map((transaction, index) => {
								return (
									<li
										key={transaction.id}
										className={`flex flex-wrap rounded-md items-center py-2 px-4 ${
											index % 2 === 0
												? "bg-amber-100"
												: ""
										}`}
									>
										<div className="w-1/12">
											{format(
												new Date(transaction.date),
												"LLL d, y"
											)}
										</div>
										<div className="w-3/12">
											{capFirstLetter(
												transaction.transactionType
											)}
											: {parseType(transaction)}
										</div>
										<div className="w-1/12">
											$
											{transaction.paymentAmount +
												transaction.donationAmount}
										</div>
										<div className="w-3/12">
											{
												transaction.vehicle?.value
													.combinedName
											}
										</div>
										<div className="w-3/12">
											{transaction.notes}
										</div>
										{["admin", "editor"].includes(
											user?.roles
										) && (
											<div className="w-1/12 flex justify-center">
												{
													transaction.createdBy.value
														.characterName
												}
											</div>
										)}
										{/* <div className="w-1/12 flex justify-center">
										<ModalToggler
											slug="addTransaction"
											className="mx-2"
										>
											<FaPen />
										</ModalToggler>
										<ModalToggler
											slug="addTransaction"
											className="mx-2"
										>
											<FaSearch />
										</ModalToggler>
									</div> */}
									</li>
								);
							})}
					</ul>
					<AddModal
						transactions={transactions}
						setTransactions={setTransactions}
					/>
				</div>
			)}
		</>
	);
}
