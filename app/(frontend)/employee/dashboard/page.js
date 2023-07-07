"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useModal } from "@faceless-ui/modal";
import { toast } from "react-toastify";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleGroup,
	CollapsibleToggler,
} from "@faceless-ui/collapsibles";

import capFirstLetter from "../../../../utils/capFirstLetter";
import getRecords from "../../../../utils/getRecords";
import { UserContext } from "../../../../components/Providers";
import AddModal from "./AddModal";

import { FaPen, FaChevronDown, FaPlus, FaSpinner } from "react-icons/fa";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const [accounts, setAccounts] = useState([]);
	const [editing, setEditing] = useState(null);

	const { user } = useContext(UserContext);
	const router = useRouter();
	const { toggleModal } = useModal();

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
					{["admin", "editor"].includes(user?.roles) && (
						<div className="w-3/4 mx-auto">
							<h1 className="text-center text-xl">
								<strong>Bank Accounts</strong>
							</h1>
							<div className="grid grid-cols-3  gap-4 pt-4">
								{accounts.map((account) => (
									<div
										key={account.id}
										className="p-2 bg-amber-100 border border-amber-300 rounded-md"
									>
										<h2 className="text-lg">
											<strong>
												{account.accountName}
											</strong>
										</h2>
										<div>${account.balance}</div>
										<div className="text-neutral-400 text-sm">
											<Link
												href={`/employee/accounts/${account.id}`}
											>
												<em className="cursor-pointer">
													View details
												</em>
											</Link>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					<div>
						<h1 className="text-center text-xl pt-4">
							<strong>Last 10 Transactions</strong>
						</h1>
						<ul className="pt-4 w-3/4 mx-auto ">
							<li className="flex flex-wrap rounded-md items-center py-2 px-4 bg-amber-300">
								<div className="w-2/12">
									<strong>Date</strong>
								</div>
								<div className="w-3/12">
									<strong>Type</strong>
								</div>
								<div className="w-2/12">
									<strong>Amount</strong>
								</div>
								<div className="w-4/12">
									<strong>Notes</strong>
								</div>
								<div className="w-1/12 flex justify-end">
									<button className="py-1 px-2 bg-amber-100 rounded">
										<FaPlus
											onClick={() => {
												setEditing(null);
												toggleModal("addTransaction");
											}}
										/>
									</button>
								</div>
							</li>
							{transactions.length === 0 && (
								<li className="flex justify-center my-4">
									There aren&apos;t any previous transactions.
								</li>
							)}
							<CollapsibleGroup>
								{transactions.length > 0 &&
									transactions.map((transaction, index) => {
										return (
											<Collapsible
												key={transaction.id}
												transTime={250}
												transCurve="ease-in"
											>
												<li
													className={`flex flex-wrap rounded-md items-center py-2 px-4 ${
														index % 2 === 0
															? "bg-amber-100"
															: ""
													}`}
												>
													<div className="w-2/12">
														{format(
															new Date(
																transaction.date
															),
															"LLL d, y"
														)}
													</div>
													<div className="w-3/12">
														{capFirstLetter(
															transaction.transactionType
														)}
														:{" "}
														{parseType(transaction)}
													</div>
													<div className="w-2/12">
														$
														{transaction.paymentAmount +
															transaction.donationAmount}
													</div>
													<div className="w-4/12">
														{transaction.notes}
													</div>
													<div className="w-1/12 flex justify-end">
														<FaPen
															className="mx-2 cursor-pointer"
															onClick={() => {
																setEditing(
																	transaction
																),
																	toggleModal(
																		"addTransaction"
																	);
															}}
														/>
														<CollapsibleToggler>
															<FaChevronDown className="mx-2 cursor-pointer" />
														</CollapsibleToggler>
													</div>
													<CollapsibleContent className="w-full text-sm">
														<hr className="h-[1px] border border-dashed border-neutral-400 my-2 w-full" />
														<div className="w-full flex flex-wrap justify-center">
															<div className="w-1/3">
																<p>
																	<strong>
																		From:
																	</strong>{" "}
																	{transaction
																		.from
																		.value
																		.companyName ||
																		transaction
																			.from
																			.value
																			.accountName ||
																		transaction
																			.from
																			.value
																			.characterName}
																</p>
																<p>
																	<strong>
																		To:
																	</strong>{" "}
																	{transaction
																		.to
																		.value
																		.companyName ||
																		transaction
																			.to
																			.value
																			.accountName ||
																		transaction
																			.to
																			.value
																			.characterName}
																</p>
															</div>
															<div className="w-1/3">
																<p>
																	<strong>
																		Payment:
																	</strong>{" "}
																	$
																	{
																		transaction.paymentAmount
																	}
																</p>
																<p>
																	<strong>
																		Donation:
																	</strong>{" "}
																	$
																	{
																		transaction.donationAmount
																	}
																</p>
															</div>
															<div className="w-1/3">
																<p>
																	<strong>
																		Vehicle:
																	</strong>{" "}
																	{transaction
																		.vehicle
																		?.value
																		.combinedName ||
																		"N/A"}
																</p>
																<p>
																	<strong>
																		Created
																		By:
																	</strong>{" "}
																	{
																		transaction
																			.createdBy
																			.value
																			.characterName
																	}
																</p>
															</div>
														</div>
													</CollapsibleContent>
												</li>
											</Collapsible>
										);
									})}
							</CollapsibleGroup>
						</ul>
					</div>
					<AddModal
						transactions={transactions}
						setTransactions={setTransactions}
						editing={editing}
					/>
				</div>
			)}
		</>
	);
}
