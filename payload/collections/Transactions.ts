import { CollectionConfig } from "payload/types";
import {
	fillRemainingBalance,
	nullConditionalFields,
	updateAccounts,
	updateToFrom,
} from "./hooks/transactionHooks";

export const Transactions: CollectionConfig = {
	slug: "transactions",
	admin: {
		group: "Finances",
		description: "List of transactions to and from bank account(s)",
		listSearchableFields: ["to", "from"],
	},
	access: {
		create: ({ req: { user } }) => {
			const allowed = ["admin", "editor", "employee"];
			return allowed.includes(user.roles);
		},
		read: ({ req: { user } }) => {
			const isRecordCreator = {
				"createdBy.value": {
					equals: user.id,
				},
			};
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles) || isRecordCreator;
		},
		update: ({ req: { user } }) => {
			const isRecordCreator = {
				"createdBy.value": {
					equals: user.id,
				},
			};
			const allowed = ["admin", "editor"];
			return allowed.includes(user.roles) || isRecordCreator;
		},
		delete: ({ req: { user } }) => user.roles === "admin",
	},
	hooks: {
		beforeChange: [
			updateToFrom,
			nullConditionalFields,
			fillRemainingBalance,
		],
		afterChange: [updateAccounts],
	},
	defaultSort: "-date",
	fields: [
		{
			name: "date",
			label: "Date",
			type: "date",
			required: true,
			admin: {
				date: {
					displayFormat: "LLL d yyyy",
				},
				width: "47.5%",
			},
		},
		{
			name: "transactionType",
			label: "Transaction Type",
			type: "select",
			required: true,
			options: [
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
			],
			admin: {
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "revenueType",
			label: "Revenue Type",
			type: "select",
			options: [
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
			],
			admin: {
				condition: (data) => {
					return data.transactionType === "revenue" ? true : false;
				},
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "donationType",
			label: "Donation Type",
			type: "select",
			options: [
				{
					label: "Cash Cab",
					value: "cashCab",
				},
				{
					label: "General",
					value: "general",
				},
			],
			admin: {
				condition: (data) => {
					return data.transactionType === "donation" ? true : false;
				},
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "expenseType",
			label: "Expense Type",
			type: "select",
			options: [
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
			],
			admin: {
				condition: (data) => {
					return data.transactionType === "expense" ? true : false;
				},
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "expenseOther",
			label: "Other",
			type: "text",
			required: true,
			admin: {
				condition: (data) => {
					return data.expenseType === "other" &&
						data.transactionType === "expense"
						? true
						: false;
				},
				width: "47.5%",
				style: {
					display: "inline-block",
				},
			},
		},
		{
			name: "noOfPassenger",
			label: "# of Passengers",
			type: "number",
			min: 0,
			max: 100,
			admin: {
				condition: (data) => {
					return data.transactionType === "revenue" ? true : false;
				},
				width: "47.5%",
				style: {
					display: "inline-block",
				},
			},
		},
		{
			name: "paymentAmount",
			label: "Payment Amount",
			type: "number",
			required: true,
			defaultValue: 0,
			admin: {
				condition: (data) => {
					return data.transactionType === "revenue" ||
						data.transactionType === "expense"
						? true
						: false;
				},
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
			},
		},
		{
			name: "donationAmount",
			label: "Donation Amount",
			type: "number",
			required: true,
			defaultValue: 0,
			admin: {
				condition: (data) => {
					return data.transactionType === "revenue" ||
						data.transactionType === "donation"
						? true
						: false;
				},
				width: "47.5%",
				style: {
					display: "inline-block",
				},
			},
		},
		{
			name: "from",
			label: "From",
			type: "relationship",
			relationTo: ["accounts", "companies", "users"],
			admin: {
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
				condition: (data) => {
					return data.transactionType;
				},
			},
		},
		{
			name: "to",
			label: "To",
			type: "relationship",
			relationTo: ["accounts", "companies", "users"],
			admin: {
				width: "47.5%",
				style: {
					display: "inline-block",
				},
				condition: (data) => {
					return data.transactionType;
				},
			},
		},

		{
			name: "fromRemaining",
			label: "From Remaining Balance",
			type: "number",
			admin: {
				width: "47.5%",
				style: {
					marginRight: "5%",
					display: "inline-block",
				},
				condition: (data) => {
					return data.transactionType;
				},
				hidden: true,
			},
		},
		{
			name: "toRemaining",
			label: "To Remaining Balance",
			type: "number",
			admin: {
				width: "47.5%",
				style: {
					display: "inline-block",
				},
				condition: (data) => {
					return data.transactionType;
				},
				hidden: true,
			},
		},
		{
			name: "notes",
			label: "Notes",
			type: "textarea",
			admin: {
				condition: (data) => {
					return data.transactionType;
				},
			},
		},
		{
			name: "vehicle",
			label: "Vehicle Used",
			type: "relationship",
			relationTo: ["vehicles"],
			admin: {
				width: "47.5%",
				style: {
					display: "inline-block",
				},
				condition: (data) => {
					return (
						data.transactionType === "expense" ||
						data.transactionType === "revenue"
					);
				},
				allowCreate: false,
			},
		},
		{
			name: "createdBy",
			label: "Created By",
			type: "relationship",
			relationTo: ["users"],
			defaultValue: ({ user }) => ({
				value: user.id,
				relationTo: user.collection,
			}),
			admin: {
				hidden: true,
			},
		},
		{
			name: "updatedBy",
			label: "Updated By",
			type: "relationship",
			relationTo: ["users"],
			defaultValue: ({ user }) => ({
				value: user.id,
				relationTo: user.collection,
			}),
			admin: {
				hidden: true,
			},
		},
	],
};
