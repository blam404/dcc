"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import capFirstLetter from "../../../../utils/capFirstLetter";
import getRecords from "../../../../utils/getRecords";
import { UserContext } from "../../../../components/Providers";

export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);

	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			const findTransactions = async () => {
				const results = await getRecords(user, false, "transactions");
				if (results.length > 0) {
					setTransactions(results);
					setLoading(false);
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
			{!loading && (
				<div className="container mx-auto">
					<h1 className="text-center text-xl">
						<strong>Last 10 Transactions</strong>
					</h1>
					<ul className="pt-4">
						<li className="flex flex-wrap rounded-md items-center py-2 px-4 bg-amber-300">
							<div className="w-1/5">
								<strong>Date</strong>
							</div>
							<div className="w-1/5">
								<strong>Type</strong>
							</div>
							<div className="w-1/5">
								<strong>Amount (Payment + Donation)</strong>
							</div>
							<div className="w-1/5">
								<strong>Vehicle</strong>
							</div>
							<div className="w-1/5">
								<strong>Notes</strong>
							</div>
						</li>
						{transactions.map((transaction, index) => {
							return (
								<li
									key={transaction.id}
									className={`flex flex-wrap rounded-md items-center py-2 px-4 ${
										index % 2 === 0 ? "bg-amber-100" : ""
									}`}
								>
									<div className="w-1/5">
										{format(
											new Date(transaction.date),
											"LLL d, y"
										)}
									</div>
									<div className="w-1/5">
										{capFirstLetter(
											transaction.transactionType
										)}
										: {parseType(transaction)}
									</div>
									<div className="w-1/5">
										$
										{transaction.paymentAmount +
											transaction.donationAmount}
									</div>
									<div className="w-1/5">
										{
											transaction.vehicle?.value
												.combinedName
										}
									</div>
									<div className="w-1/5">
										{transaction.notes}
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</>
	);
}
