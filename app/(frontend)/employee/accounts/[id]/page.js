"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleGroup,
	CollapsibleToggler,
} from "@faceless-ui/collapsibles";
import { format } from "date-fns";

import getRecords from "../../../../../utils/getRecords";
import getDocs from "./getDocs";
import capFirstLetter from "../../../../../utils/capFirstLetter";
import { UserContext } from "../../../../../components/Providers";

import { FaChevronDown, FaSpinner } from "react-icons/fa";

export async function generateStaticParams() {
	const accounts = await getRecords(null, true, "accounts");

	return accounts.success.map((account) => {
		return {
			id: account.id,
		};
	});
}

export default function Account({ params }) {
	const [loading, setLoading] = useState(true);
	const [transactions, setTransaction] = useState([]);
	const [account, setAccount] = useState({});

	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			const getTheThing = async () => {
				const results = await getDocs(params.id);
				if (results.success) {
					setTransaction(results.transactions);
					setAccount(results.account);
					setLoading(false);
				} else if (results.error) {
					setLoading(false);
					toast.error(`Error message: ${results.error}`, {
						toastId: "docError",
					});
				}
			};
			getTheThing();
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
					<div className="w-3/4 mx-auto">
						<ul className="pt-4">
							<li className="rounded-md bg-amber-300 flex flex-wrap items-center px-4 py-2">
								<div className="w-9/12">
									<strong>{account.accountName}</strong>
								</div>
								<div className="w-2/12 text-right">
									<strong>${account.balance}</strong>
								</div>
								<div className="w-1/12 text-right"></div>
							</li>
							{transactions.length === 0 && (
								<li className="flex justify-center my-4">
									There aren&apos;t any previous transactions.
								</li>
							)}
							<CollapsibleGroup>
								{transactions.length > 0 &&
									transactions.map((transaction, index) => {
										const remaining =
											transaction.from.value.id ===
											params.id
												? transaction.fromRemaining
												: transaction.toRemaining;
										const positive =
											transaction.to.value.id ===
											params.id;
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
													<div className="w-9/12">
														<p className="text-sm">
															{format(
																new Date(
																	transaction.date
																),
																"LLL d, y"
															)}
														</p>
														<p>
															{capFirstLetter(
																transaction.transactionType
															)}
															:{" "}
															{parseType(
																transaction
															)}
														</p>
													</div>
													<div className="w-2/12 text-right">
														<p
															style={{
																color: positive
																	? "green"
																	: "red",
															}}
														>
															$
															{transaction.paymentAmount +
																transaction.donationAmount}
														</p>
														<p className="text-sm">
															${remaining}
														</p>
													</div>
													<div className="w-1/12"></div>
												</li>
											</Collapsible>
										);
									})}
							</CollapsibleGroup>
						</ul>
					</div>
				</div>
			)}
		</>
	);
}
