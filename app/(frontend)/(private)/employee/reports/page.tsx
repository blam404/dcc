"use client";

import React, { useContext, useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Popover, Transition } from "@headlessui/react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleGroup,
	CollapsibleToggler,
} from "@faceless-ui/collapsibles";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "~components/Button";
import { ContainerBox, ContainerWrapper } from "~components/Container";
import PageLoading from "~components/PageLoading";
import { MenuContext, UserContext } from "~components/Providers";
import getTransactions from "~utils/getTransactions";
// import getRecords from "~utils/getRecords";
import {
	// allFields,
	// transactionType,
	// revenueType,
	// donationType,
	secondaryTypeLabel,
} from "~utils/companySpecifics";
import useMediaQuery, { breakpoint } from "~utils/useMediaQuery";
import capFirstLetter from "~utils/capFirstLetter";

import {
	Account,
	Transaction,
	Vehicle,
	Company,
	User,
} from "~types/Payload.types";

import {
	FaChevronDown,
	FaDownload,
	FaInfoCircle,
	FaSpinner,
} from "react-icons/fa";

type CSV = {
	csvData: {}[];
	csvHeader: {}[];
};

export default function Reports() {
	const [pending, startTransition] = useTransition();
	const [loading, setLoading] = useState(true);
	// const [outerFilter, setOuterFilter] = useState<string>("0");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState(new Date());
	const [report, setReport] = useState<Transaction[]>([]);
	const [csv, setCsv] = useState<CSV | null>();
	// const [filters, setFilter] = useState<(string | Date | null)[][][]>([
	// 	[["date", "equals", new Date()]],
	// ]);
	// const [date, setDate] = useState<Date | null>(null);

	// const [companyList, setCompanyList] = useState<Company[]>([]);
	// const [accountList, setAccountList] = useState<Account[]>([]);
	// const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
	// const [userList, setUserList] = useState<User[]>([]);

	const { setPageTitle } = useContext(MenuContext);
	const { user } = useContext(UserContext);

	const md = useMediaQuery(breakpoint.md);
	const lg = useMediaQuery(breakpoint.lg);

	useEffect(() => {
		setPageTitle("Reports");
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	//get all lists
	// useEffect(() => {
	// 	if (user) {
	// 		const getAllList = async () => {
	// 			const accounts = await getRecords(
	// 				user,
	// 				false,
	// 				"accounts",
	// 				0,
	// 				false
	// 			);
	// 			if (accounts.success) {
	// 				setAccountList(accounts.success);
	// 			} else if (accounts.error) {
	// 				toast.error(
	// 					"There was an error contacting the database. Try again or contact the admin if the problem persists.",
	// 					{
	// 						toastId: "accountGetRecords.",
	// 					}
	// 				);
	// 			}
	// 			const vehicles = await getRecords(
	// 				user,
	// 				false,
	// 				"vehicles",
	// 				0,
	// 				false
	// 			);
	// 			if (vehicles.success) {
	// 				setVehicleList(vehicles.success);
	// 			} else if (vehicles.error) {
	// 				toast.error(
	// 					"There was an error contacting the database. Try again or contact the admin if the problem persists.",
	// 					{
	// 						toastId: "vehicleGetRecords.",
	// 					}
	// 				);
	// 			}
	// 			const companies = await getRecords(
	// 				user,
	// 				false,
	// 				"companies",
	// 				0,
	// 				false
	// 			);
	// 			if (companies.success) {
	// 				setCompanyList(companies.success);
	// 			} else if (companies.error) {
	// 				toast.error(
	// 					"There was an error contacting the database. Try again or contact the admin if the problem persists.",
	// 					{
	// 						toastId: "companiesGetRecords.",
	// 					}
	// 				);
	// 			}

	// 			const users = await getRecords(user, true, "users", 0, false);
	// 			if (users.success) {
	// 				setUserList(users.success);
	// 			} else if (users.error) {
	// 				toast.error(
	// 					"There was an error contacting the database. Try again or contact the admin if the problem persists.",
	// 					{
	// 						toastId: "companiesGetRecords.",
	// 					}
	// 				);
	// 			}
	// 		};
	// 		getAllList();
	// 	}
	// }, [user]);

	// const operatorList = [
	// 	{
	// 		label: "equals",
	// 		value: "equals",
	// 	},
	// 	{
	// 		label: "not equals",
	// 		value: "not_equals",
	// 	},
	// 	{
	// 		label: "greater than",
	// 		value: "greater_than",
	// 	},
	// 	{
	// 		label: "greater than or equals",
	// 		value: "greater_than_equal",
	// 	},
	// 	{
	// 		label: "less than",
	// 		value: "less_than",
	// 	},
	// 	{
	// 		label: "less than or equals",
	// 		value: "less_than_equal",
	// 	},
	// ];

	// const handleFilterUpdate = (outer, inner, current, value) => {
	// 	const working = [...filters];
	// 	working[outer][inner][current] = value;
	// 	working[outer][inner][2] = null;
	// 	setFilter(working);
	// };

	// const createValueField = (outerIndex, innerIndex) => {
	// 	const field = filters[outerIndex][innerIndex][0] || "date";

	// 	if (
	// 		[
	// 			"transactionType",
	// 			"donationType",
	// 			"revenueType",
	// 			"expenseType",
	// 		].includes(field as string)
	// 	) {
	// 		let renderType;
	// 		switch (field) {
	// 			case "transactionType":
	// 				renderType = transactionType;
	// 				break;
	// 			case "donationType":
	// 				renderType = donationType;
	// 				break;
	// 			case "revenueType":
	// 				renderType = revenueType;
	// 				break;
	// 			case "expenseType":
	// 				renderType = expenseType;
	// 		}
	// 		return (
	// 			<select
	// 				className="ml-2 px-1"
	// 				onChange={(e) => {
	// 					handleFilterUpdate(
	// 						outerIndex,
	// 						innerIndex,
	// 						2,
	// 						e.target.value
	// 					);
	// 				}}
	// 			>
	// 				{renderType.map((type) => (
	// 					<option value={type.value} key={type.value}>
	// 						{type.label}
	// 					</option>
	// 				))}
	// 			</select>
	// 		);
	// 	} else if (
	// 		["noOfPassengers", "paymentAmount", "donationAmount"].includes(
	// 			field as string
	// 		)
	// 	) {
	// 		return (
	// 			<input
	// 				type="number"
	// 				className="ml-2 px-1"
	// 				onChange={(e) => {
	// 					handleFilterUpdate(
	// 						outerIndex,
	// 						innerIndex,
	// 						2,
	// 						e.target.value
	// 					);
	// 				}}
	// 			/>
	// 		);
	// 	} else if (["from.value", "to.value"].includes(field as string)) {
	// 		return (
	// 			<select
	// 				className="ml-2 px-1"
	// 				onChange={(e) => {
	// 					handleFilterUpdate(
	// 						outerIndex,
	// 						innerIndex,
	// 						2,
	// 						e.target.value
	// 					);
	// 				}}
	// 			>
	// 				{accountList.map((account, index) => (
	// 					<option value={account.id} key={account.id}>
	// 						{account.accountName}
	// 					</option>
	// 				))}
	// 				{companyList.map((company, index) => (
	// 					<option value={company.id} key={company.id}>
	// 						{company.companyName}
	// 					</option>
	// 				))}
	// 				{userList.map((user, index) => (
	// 					<option value={user.id} key={user.id}>
	// 						{user.characterName}
	// 					</option>
	// 				))}
	// 			</select>
	// 		);
	// 	} else if (field === "vehicle.value") {
	// 		return (
	// 			<select
	// 				className="ml-2 px-1"
	// 				onChange={(e) => {
	// 					handleFilterUpdate(
	// 						outerIndex,
	// 						innerIndex,
	// 						2,
	// 						e.target.value
	// 					);
	// 				}}
	// 			>
	// 				{vehicleList.map((vehicle, index) => (
	// 					<option value={vehicle.id} key={vehicle.id}>
	// 						{vehicle.combinedName}
	// 					</option>
	// 				))}
	// 			</select>
	// 		);
	// 	} else if (field === "createdBy.value") {
	// 		return (
	// 			<select
	// 				className="ml-2 px-1"
	// 				onChange={(e) => {
	// 					handleFilterUpdate(
	// 						outerIndex,
	// 						innerIndex,
	// 						2,
	// 						e.target.value
	// 					);
	// 				}}
	// 			>
	// 				{userList.map((user, index) => (
	// 					<option value={user.id} key={user.id}>
	// 						{user.characterName}
	// 					</option>
	// 				))}
	// 			</select>
	// 		);
	// 	} else if (field === "date") {
	// 		return (
	// 			<DatePicker
	// 				className="ml-2 px-2"
	// 				selected={filters[outerIndex][innerIndex][2] || new Date()}
	// 				onChange={(date) =>
	// 					handleFilterUpdate(outerIndex, innerIndex, 2, date)
	// 				}
	// 				dateFormat="LLL d, y"
	// 			/>
	// 		);
	// 	} else {
	// 		return null;
	// 	}
	// };

	// console.log("filters: ", filters);

	const handleSubmit = async () => {
		const results = await getTransactions(
			user,
			0,
			false,
			startDate,
			endDate,
			1
		);

		if (results.success) {
			setReport(results.success);
			const csvData = results.success.map((transaction) => {
				return {
					date: transaction.date,
					transactionType: transaction.transactionType,
					expenseType: transaction.expenseType,
					donationType: transaction.donationType,
					revenueType: transaction.revenueType,
					donationAmount: transaction.donationAmount,
					paymentAmount: transaction.paymentAmount,
					from:
						transaction.from.value.companyName ||
						transaction.from.value.characterName ||
						transaction.from.value.accountName,
					to:
						transaction.to.value.companyName ||
						transaction.to.value.characterName ||
						transaction.from.value.accountName,
					noOfPassenger: transaction.noOfPassenger,
					vehicle: transaction.vehicle?.value.combinedName,
					notes: transaction.notes,
				};
			});
			const csvHeader = [
				{
					label: "Date",
					key: "date",
				},
				{
					label: "Transaction Type",
					key: "transactionType",
				},
				{
					label: "Expense Type",
					key: "expenseType",
				},
				{
					label: "Donation Type",
					key: "donationType",
				},
				{
					label: "Revenue Type",
					key: "revenueType",
				},
				{
					label: "Payment Amount",
					key: "paymentAmount",
				},
				{
					label: "Donation Amount",
					key: "donationAmount",
				},
				{
					label: "From",
					key: "from",
				},
				{
					label: "To",
					key: "to",
				},
				{
					label: "Number of Passenger",
					key: "noOfPassenger",
				},
				{
					label: "Vehicle",
					key: "vehicle",
				},
				{
					label: "Notes",
					key: "notes",
				},
			];
			setCsv({ csvData, csvHeader });
		} else if (results.error) {
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

	return !loading ? (
		<div className="container mx-auto py-8 px-4 md:px-8">
			<ContainerWrapper col={1} className="pt-2">
				<ContainerBox>
					<div>
						<span className="text-sm">Filters</span>
						<Popover className="relative inline-block ml-2">
							<Popover.Button className="align-middle">
								<FaInfoCircle className="w-4 h-4" />
							</Popover.Button>
							<Transition
								enter="transition-opacity ease-linear duration-200"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="transition-opacity ease-linear duration-200"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Popover.Panel className="absolute z-10">
									<div className="bg-primary-xlight p-4 rounded-md border border-primary w-72 shadow-md">
										Filter is currently limited to the
										transaction date. Additional field
										filters will be added in a future
										update.
									</div>
								</Popover.Panel>
							</Transition>
						</Popover>
					</div>
					<div>
						<ul>
							<li>
								Transactions between:
								<DatePicker
									className="mx-2 px-2"
									selected={startDate}
									onChange={(date) => setStartDate(date)}
									dateFormat="LLL d, y"
								/>
								and
								<DatePicker
									className="ml-2 px-2"
									selected={endDate}
									onChange={(date) => setEndDate(date)}
									dateFormat="LLL d, y"
								/>
							</li>
						</ul>
						<div className="text-center mt-4">
							<Button
								disabled={pending}
								onClick={async () => {
									startTransition(handleSubmit);
								}}
							>
								{pending ? (
									<FaSpinner className="animate-spin h-6 w-6" />
								) : (
									"Run"
								)}
							</Button>
						</div>
						{/* <ul className="tree">
							<li>
								<select
									onChange={(e) =>
										setOuterFilter(e.target.value)
									}
									value={outerFilter}
								>
									<option
										disabled={outerFilter !== "0"}
										value={"0"}
									>
										----
									</option>
									<option value="and">AND</option>
									<option value="or">OR</option>
								</select>
								{outerFilter && (
									<Button className="ml-2">
										<FaPlus
											onClick={() =>
												console.log("add filter")
											}
										/>
									</Button>
								)}
								{filters.map((outer, outerIndex) => (
									<>
										{outerIndex !== 0 && (
											<hr className="my-4 border-neutral-400 w-11/12 mx-auto" />
										)}
										<ul key={outerIndex}>
											<li className="py-2">
												{outer.map(
													(inner, innerIndex) => (
														<div
															key={innerIndex}
															className="my-2"
														>
															<select
																className="px-1"
																onChange={(
																	e
																) => {
																	handleFilterUpdate(
																		outerIndex,
																		innerIndex,
																		0,
																		e.target
																			.value
																	);
																}}
															>
																{allFields.map(
																	(
																		field,
																		index
																	) => (
																		<option
																			key={
																				field.value
																			}
																			value={
																				field.filterValue ||
																				field.value
																			}
																		>
																			{
																				field.label
																			}
																		</option>
																	)
																)}
															</select>
															<select
																className="ml-2 px-1"
																onChange={(
																	e
																) => {
																	handleFilterUpdate(
																		outerIndex,
																		innerIndex,
																		1,
																		e.target
																			.value
																	);
																}}
															>
																{operatorList.map(
																	(
																		operator
																	) => (
																		<option
																			key={
																				operator.value
																			}
																			value={
																				operator.value
																			}
																		>
																			{
																				operator.label
																			}
																		</option>
																	)
																)}
															</select>
															{createValueField(
																outerIndex,
																innerIndex
															)}
														</div>
													)
												)}
											</li>
										</ul>
									</>
								))}
							</li>
						</ul> */}
					</div>
				</ContainerBox>
			</ContainerWrapper>
			{report.length > 0 && (
				<div className="pt-4">
					<ContainerWrapper col={1}>
						<ContainerBox>
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
											<CSVLink
												data={csv?.csvData}
												headers={csv?.csvHeader}
												filename={`transactionReport_${Math.floor(
													new Date(
														"2012.08.10"
													).getTime() / 1000
												)}.csv`}
											>
												<FaDownload />
											</CSVLink>
										</Button>
									</div>
								</li>
								{report.length === 0 && (
									<li className="flex justify-center my-4">
										There aren&apos;t any previous
										transactions.
									</li>
								)}
								<CollapsibleGroup>
									{report.length > 0 &&
										report.map((transaction, index) => {
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
																{
																	transaction.notes
																}
															</div>
														)}

														<div className="col-span-1 md:col-span-2 lg:col-span-1 flex justify-end">
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
																		<Button className="text-sm">
																			Edit
																			Transaction
																		</Button>
																	</div>
																)}
															</div>
														</CollapsibleContent>
													</li>
													{index !==
														report.length - 1 && (
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
			)}
		</div>
	) : (
		<PageLoading />
	);
}
