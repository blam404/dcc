"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleGroup,
	CollapsibleToggler,
} from "@faceless-ui/collapsibles";
import { format } from "date-fns";

import getRecords from "~utils/getRecords";
import getAccTransactions from "./getAccTransactions";
import capFirstLetter from "~utils/capFirstLetter";
import { MenuContext, UserContext } from "~components/Providers";
import { ContainerWrapper, ContainerBox } from "~components/Container";

import {
	Account,
	Transaction,
	Vehicle,
	User,
	Company,
} from "~types/Payload.types";
import { Meta } from "~types/PayloadAdd.types";

import {
	FaChevronDown,
	FaChevronLeft,
	FaChevronRight,
	FaSpinner,
} from "react-icons/fa";
import { secondaryTypeLabel } from "~utils/companySpecifics";

export async function generateStaticParams() {
	const accounts = await getRecords(null, true, "accounts");

	if (accounts.success) {
		return accounts.success.map((account) => {
			return {
				id: account.id,
			};
		});
	} else {
		return [];
	}
}

export default function Accounts({ params }) {
	const [loading, setLoading] = useState<boolean>(true);
	const [transactions, setTransaction] = useState<Transaction[]>([]);
	const [account, setAccount] = useState<Account>({} as Account);
	const [meta, setMeta] = useState<Meta>({} as Meta);
	const [page, setPage] = useState<number>(1);

	const { user } = useContext(UserContext);
	const { setPageTitle } = useContext(MenuContext);

	useEffect(() => {
		setPageTitle("Accounts");
	}, []);

	useEffect(() => {
		if (user) {
			const getTheThing = async () => {
				const results = await getAccTransactions(params.id);
				if (results.success) {
					setTransaction(results.transactions.docs);
					setAccount(results.account);
					setMeta(results.transactions);
					setLoading(false);
				} else if (results.error) {
					setLoading(false);
					toast.error(`Error message: ${results.error}`, {
						toastId: "docError",
					});
				}
			};
			getTheThing();
		}
	}, [user]);

	const Pages = () => {
		const pageNum: number[] = [];

		let count = -2;
		while (pageNum.length < 5 && page + count <= meta.totalPages) {
			if (page + count > 0) {
				pageNum.push(page + count);
			}
			count++;
		}

		const goToPage = async (newPage) => {
			setLoading(true);
			const results = await getAccTransactions(params.id, 10, newPage);
			if (results.success) {
				setTransaction(results.transactions.docs);
				setMeta(results.transactions);
				setLoading(false);
				setPage(newPage);
			} else {
				//add things if there is an error
			}
		};

		return meta.totalPages > 1 ? (
			<div className="pt-4 flex justify-center">
				{meta.hasPrevPage && (
					<button
						onClick={() => goToPage(meta.prevPage)}
						className="py-1 px-3 rounded-md bg-amber-300 mx-1"
					>
						<FaChevronLeft className="h-4 w-4" />
					</button>
				)}
				{pageNum.map((number) => (
					<button
						key={number}
						onClick={() => goToPage(number)}
						disabled={number === page}
						className="py-1 px-3 rounded-md bg-amber-300 mx-1"
					>
						{number}
					</button>
				))}
				{meta.hasNextPage && (
					<button
						onClick={() => goToPage(meta.nextPage)}
						className="py-1 px-3 rounded-md bg-amber-300 mx-1"
					>
						<FaChevronRight className="h-4 w-4" />
					</button>
				)}
			</div>
		) : null;
	};

	return (
		<>
			{loading && (
				<div className="absolute top-1/4 -translate-y-1/4 left-1/2 -translate-x-1/2">
					<FaSpinner className="animate-spin h-12 w-12" />
				</div>
			)}
			{!loading && (
				<div className="container mx-auto py-8 px-4 md:px-8">
					<h1 className="text-xl font-bold">{account.accountName}</h1>
					<h2 className="text-2xl font-bold">${account.balance}</h2>
					<div className="pt-4">
						<ContainerWrapper col={1}>
							<ContainerBox>
								<div className="text-sm">
									Previous Transactions
								</div>
								<ul className="pt-2">
									<li className="rounded-md bg-amber-300 grid grid-cols-12 items-center px-4 py-2 text-sm md:text-base">
										<div className="col-span-8 md:col-span-9">
											<strong>Transaction Type</strong>
										</div>
										<div className="col-span-3 md:col-span-2 text-center md:text-end">
											<strong>Amount</strong>
										</div>
										<div className="col-span-1 text-right"></div>
									</li>
									{transactions.length === 0 && (
										<li className="flex justify-center my-4">
											There aren&apos;t any previous
											transactions.
										</li>
									)}
									<CollapsibleGroup>
										{transactions.length > 0 &&
											transactions.map(
												(transaction, index) => {
													const remaining =
														(
															transaction.from
																.value as
																| Account
																| Company
																| User
														).id === params.id
															? transaction.fromRemaining
															: transaction.toRemaining;
													const positive =
														(
															transaction.to
																.value as
																| Account
																| Company
																| User
														).id === params.id;
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
															<li className="grid grid-cols-12 rounded-md items-center py-2 px-4">
																<div className="col-span-8 md:col-span-9">
																	<p>
																		{capFirstLetter(
																			transaction.transactionType
																		)}
																		:{" "}
																		{type !==
																		"other"
																			? secondaryTypeLabel[
																					type
																			  ]
																			: transaction.expenseOther}
																	</p>
																	<p className="text-sm text-neutral-400">
																		{format(
																			new Date(
																				transaction.date
																			),
																			"LLL d, y"
																		)}
																	</p>
																</div>
																<div className="col-span-3 md:col-span-2 text-center md:text-end">
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
																	<p className="text-sm text-neutral-400">
																		$
																		{
																			remaining
																		}
																	</p>
																</div>
																<div className="col-span-1 text-end">
																	<CollapsibleToggler>
																		<FaChevronDown className="mx-2 cursor-pointer" />
																	</CollapsibleToggler>
																</div>
																<CollapsibleContent className="w-full text-sm col-span-12">
																	<hr className="h-[1px] border border-dashed border-neutral-400 my-2 w-full" />
																	<div className="w-full grid grid-cols-12">
																		<div className="col-span-12 md:col-span-4">
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
																		<div className="col-span-12 md:col-span-4">
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
																		<div className="col-span-12 md:col-span-4">
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
																		<div className="col-span-12 md:col-span-12">
																			<p>
																				<strong>
																					Notes:
																				</strong>{" "}
																				{
																					transaction.notes
																				}
																			</p>
																		</div>
																	</div>
																</CollapsibleContent>
															</li>
															{index !==
																transactions.length -
																	1 && (
																<hr className="my-2 border-neutral-400" />
															)}
														</Collapsible>
													);
												}
											)}
									</CollapsibleGroup>
								</ul>
								<Pages />
							</ContainerBox>
						</ContainerWrapper>
					</div>
				</div>
			)}
		</>
	);
}
