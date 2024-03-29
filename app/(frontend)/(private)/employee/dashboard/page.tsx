"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { format, isSameDay, parseISO, sub } from "date-fns";
import { toast } from "react-toastify";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleGroup,
	CollapsibleToggler,
} from "@faceless-ui/collapsibles";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ContainerWrapper, ContainerBox } from "~components/Container";
import capFirstLetter from "~utils/capFirstLetter";
import getRecords from "~utils/getRecords";
import getTransactions from "~utils/getTransactions";
import { MenuContext, UserContext } from "~components/Providers";
import AddEdit from "./AddEdit";
import { secondaryTypeLabel } from "~utils/companySpecifics";
import useMediaQuery, { breakpoint } from "~utils/useMediaQuery";

import {
	Account,
	Transaction,
	Vehicle,
	User,
	Company,
} from "~types/Payload.types";

import { FaPen, FaChevronDown, FaPlus } from "react-icons/fa";
import { LuArrowDownCircle, LuArrowUpCircle } from "react-icons/lu";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Button from "~components/Button";
import PageLoading from "~components/PageLoading";

type GraphData = {
	date: string;
	revenue: number;
	expense: number;
};

export default function Dashboard() {
	const [loading, setLoading] = useState<boolean>(true);
	const [isOpen, setIsOpen] = useState(false);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [editing, setEditing] = useState<Transaction | null>(null);
	const [graphData, setGraphData] = useState<GraphData[]>([]);

	const { user } = useContext(UserContext);
	const { setPageTitle } = useContext(MenuContext);
	const md = useMediaQuery(breakpoint.md);
	const lg = useMediaQuery(breakpoint.lg);

	useEffect(() => {
		setPageTitle("Dashboard");
	}, []);

	useEffect(() => {
		if (user) {
			const greaterThan = sub(new Date(), {
				days: 30,
			});
			const findTransactions = async () => {
				const results = await getTransactions(
					user,
					0,
					false,
					greaterThan
				);
				if (results.success) {
					setAllTransactions(results.success);
					setTransactions(results.success.slice(0, 10));
					const asc = [...results.success].sort(
						(a, b) =>
							new Date(a.date).getTime() -
							new Date(b.date).getTime()
					);
					const graph: GraphData[] = [];
					asc.forEach((transaction) => {
						const isRev =
							transaction.transactionType === "revenue" ||
							transaction.transactionType === "donation";
						const isExp = transaction.transactionType === "expense";
						const total =
							transaction.paymentAmount +
							transaction.donationAmount;
						const index = graph.findIndex((data) => {
							return isSameDay(
								parseISO(data?.date),
								parseISO(transaction.date)
							);
						});
						if (index !== -1) {
							const newData = {
								date: graph[index].date,
								revenue: isRev
									? graph[index].revenue + total
									: graph[index].revenue,
								expense: isExp
									? graph[index].expense + total
									: graph[index].expense,
							};
							graph[index] = newData;
						} else {
							graph.push({
								date: transaction.date,
								revenue: isRev ? total : 0,
								expense: isExp ? total : 0,
							});
						}
						setGraphData(graph);
					});
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

	const revTrans = allTransactions.filter(
		(transaction) =>
			transaction.transactionType === "revenue" ||
			transaction.transactionType === "donation"
	);
	const expTrans = allTransactions.filter(
		(transaction) => transaction.transactionType === "expense"
	);

	const revenue = revTrans.reduce(
		(acc, transaction) =>
			acc + transaction.paymentAmount + transaction.donationAmount,
		revTrans[0]?.paymentAmount + revTrans[0]?.donationAmount
	);

	const expense = expTrans.reduce(
		(acc, transaction) =>
			acc + transaction.paymentAmount + transaction.donationAmount,
		expTrans[0]?.paymentAmount + expTrans[0]?.donationAmount
	);

	return !loading ? (
		<div className="container mx-auto py-8 px-4 md:px-8">
			{accounts.length > 0 && (
				<>
					<h1 className="text-2xl font-bold">Accounts</h1>
					<ContainerWrapper col={md ? 3 : 1} className="pt-2">
						{accounts.map((account) => (
							<ContainerBox key={account.id}>
								<div>
									<p className="text-sm">
										{account.accountName}
									</p>
									<p className="text-lg font-bold">
										${account.balance}
									</p>
									<p className="text-sm text-neutral-400">
										<Link
											href={`/employee/accounts/${account.id}`}
										>
											View details
										</Link>
									</p>
								</div>
							</ContainerBox>
						))}
					</ContainerWrapper>
					<hr className="my-4 border-neutral-400" />
				</>
			)}

			<h1 className="text-2xl font-bold">30-Day Statistics</h1>
			<ContainerWrapper col={md ? 3 : 1} className="pt-2">
				<ContainerBox>
					<div className="flex items-center">
						<div className="mr-2">
							<LuArrowDownCircle className="text-green-600 w-10 h-10  rounded-full p-2 bg-green-50 border border-green-600" />
						</div>
						<div>
							<p className="text-sm">Total Revenue</p>
							<p className="text-lg font-bold">${revenue || 0}</p>
						</div>
					</div>
				</ContainerBox>
				<ContainerBox>
					<div className="flex items-center">
						<div className="mr-2">
							<LuArrowUpCircle className="text-red-600 w-10 h-10  rounded-full p-2 bg-red-50 border border-red-600" />
						</div>
						<div>
							<p className="text-sm">Total Expense</p>

							<p className="text-lg font-bold">${expense || 0}</p>
						</div>
					</div>
				</ContainerBox>
				<ContainerBox>
					<div className="flex items-center">
						<div className="mr-2">
							<RiMoneyDollarCircleLine className="text-primary w-10 h-10  rounded-full p-2 bg-primary-xlight border border-primary" />
						</div>
						<div>
							<p className="text-sm">Total Salary</p>
							<p className="text-lg font-bold">$42069</p>
						</div>
					</div>
				</ContainerBox>
			</ContainerWrapper>
			{graphData.length > 0 && (
				<div className="pt-4">
					<ContainerWrapper col={1}>
						<ContainerBox>
							<ResponsiveContainer
								width="100%"
								height={200}
								className="pt-2"
							>
								<BarChart data={graphData}>
									<CartesianGrid stroke="#ccc" />
									<XAxis
										dataKey="date"
										height={25}
										tickFormatter={(value) =>
											format(parseISO(value), "LLL d")
										}
										className={md ? "text-base" : "text-sm"}
										tick={{ strokeWidth: "1" }}
									/>
									<YAxis
										tickFormatter={(value) => `$${value}`}
										className={md ? "text-base" : "text-sm"}
									/>
									<Tooltip
										formatter={(value) => `$${value}`}
										labelFormatter={(value) =>
											format(
												parseISO(value),
												"LLL d, yyyy"
											)
										}
									/>
									<Legend />
									<Bar dataKey="revenue" fill="#16a34a" />
									<Bar dataKey="expense" fill="#dc2626" />
								</BarChart>
							</ResponsiveContainer>
						</ContainerBox>
					</ContainerWrapper>
				</div>
			)}

			<div className="pt-4">
				<ContainerWrapper col={1}>
					<ContainerBox>
						<div className="text-sm">Previous 10 Transactions</div>
						<ul className="pt-2">
							<li className="grid grid-cols-12 rounded-md items-center py-2 px-4 bg-primary text-sm md:text-base">
								<div className="col-span-4 md:col-span-3 lg:col-span-2">
									<strong>Date</strong>
								</div>
								<div className="col-span-4 lg:col-span-3">
									<strong>Type</strong>
								</div>
								<div className="col-span-3 lg:col-span-2 text-center">
									<strong>Amount</strong>
								</div>
								{lg && (
									<div className="col-span-4">
										<strong>Notes</strong>
									</div>
								)}

								<div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-end">
									<Button className="!bg-primary-light">
										<FaPlus
											onClick={() => {
												setEditing(null);
												setIsOpen(true);
											}}
										/>
									</Button>
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
										const type =
											transaction.revenueType ||
											transaction.expenseType ||
											transaction.donationType;
										return (
											<Collapsible
												key={transaction.id}
												transTime={250}
												transCurve="ease-in"
											>
												<li className="grid grid-cols-12 rounded-md items-center py-2 px-4 text-sm md:text-base">
													<div className="col-span-4 md:col-span-3 lg:col-span-2">
														{format(
															new Date(
																transaction.date
															),
															"LLL d, y"
														)}
													</div>
													<div className="col-span-4 lg:col-span-3">
														{capFirstLetter(
															transaction.transactionType
														)}
														:{" "}
														{type !== "other"
															? secondaryTypeLabel[
																	type
															  ]
															: transaction.expenseOther}
													</div>
													<div className="col-span-3 lg:col-span-2 text-center">
														$
														{transaction.paymentAmount +
															transaction.donationAmount}
													</div>
													{lg && (
														<div className="col-span-4">
															{transaction.notes}
														</div>
													)}

													<div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-end">
														{md && (
															<FaPen
																className="mx-2 cursor-pointer"
																onClick={() => {
																	setEditing(
																		transaction
																	),
																		setIsOpen(
																			true
																		);
																}}
															/>
														)}
														<CollapsibleToggler>
															<FaChevronDown className="mx-2 cursor-pointer" />
														</CollapsibleToggler>
													</div>

													<CollapsibleContent className="w-full text-sm col-span-12">
														<hr className="h-[1px] border border-dashed border-neutral-400 my-2 w-full" />
														<div className="w-full grid grid-cols-12">
															<div className="col-span-6 md:col-span-4">
																<p>
																	<strong>
																		From:
																	</strong>{" "}
																	{(
																		transaction
																			.from
																			.value as Company
																	)
																		.companyName ||
																		(
																			transaction
																				.from
																				.value as Account
																		)
																			.accountName ||
																		(
																			transaction
																				.from
																				.value as User
																		)
																			.characterName}
																</p>
																<p>
																	<strong>
																		To:
																	</strong>{" "}
																	{(
																		transaction
																			.to
																			.value as Company
																	)
																		.companyName ||
																		(
																			transaction
																				.to
																				.value as Account
																		)
																			.accountName ||
																		(
																			transaction
																				.to
																				.value as User
																		)
																			.characterName}
																</p>
															</div>
															<div className="col-span-6 md:col-span-4">
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
															<div className="col-span-6 md:col-span-4">
																<p>
																	<strong>
																		Vehicle:
																	</strong>{" "}
																	{(transaction.vehicle &&
																		(
																			transaction
																				.vehicle
																				?.value as Vehicle
																		)
																			.combinedName) ||
																		"N/A"}
																</p>
																<p>
																	<strong>
																		Created
																		By:
																	</strong>{" "}
																	{
																		(
																			transaction
																				.createdBy
																				.value as User
																		)
																			.characterName
																	}
																</p>
															</div>
															{!lg &&
																transaction.notes && (
																	<div className="col-span-6 md:col-span-12">
																		<p>
																			<strong>
																				Notes:
																			</strong>{" "}
																			{
																				transaction.notes
																			}
																		</p>
																	</div>
																)}
															{!md && (
																<div className="col-span-12 text-center pt-2">
																	<Button
																		className="text-sm"
																		onClick={() => {
																			setEditing(
																				transaction
																			),
																				setIsOpen(
																					true
																				);
																		}}
																	>
																		Edit
																		Transaction
																	</Button>
																</div>
															)}
														</div>
													</CollapsibleContent>
												</li>
												{index !==
													transactions.length - 1 && (
													<hr className="my-2 border-neutral-400" />
												)}
											</Collapsible>
										);
									})}
							</CollapsibleGroup>
						</ul>
					</ContainerBox>
				</ContainerWrapper>
			</div>

			<AddEdit
				transactions={transactions}
				setTransactions={setTransactions}
				editing={editing}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</div>
	) : (
		<PageLoading />
	);
}
