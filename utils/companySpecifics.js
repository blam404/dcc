//dashboard and accounts page
export const secondaryTypeLabel = {
	gas: "Gas",
	cashCab: "Cash Cab",
	taxi: "Taxi Service",
	general: "General",
	limo: "Limo Service",
	city: "City Tour",
	gang: "Gang Tour",
	helicoptor: "Helicoptor Tour",
	submarine: "Submarine Tour",
	foodDrink: "Food/Drinks",
	payroll: "Payroll",
	repairs: "Repairs",
};

// transactionHooks
export const botUser = {
	id: "6492312d69e524c5ca439c7a",
	collection: "users",
	characterName: "Bot",
	email: "robot@dcc.com",
	roles: "editor",
};

// add/edit modal and everything else
export const allFields = [
	{ label: "Date", value: "date" },
	{ label: "Transaction Type", value: "transactionType" },
	{ label: "Revenue Type", value: "revenueType" },
	{ label: "Donation Type", value: "donationType" },
	{ label: "Expense Type", value: "expenseType" },
	{ label: "# of Passengers", value: "noOfPassengers" },
	{ label: "Payment Amount", value: "paymentAmount" },
	{ label: "Donation Amount", value: "donationAmount" },
	{ label: "From", value: "from", filterValue: "from.value" },
	{ label: "To", value: "to", filterValue: "to.value" },
	{ label: "Vehicle Used", value: "vehicle", filterValue: "vehicle.value" },
	{ label: "Created By", value: "createdBy", filterValue: "createdBy.value" },
];

export const transactionType = [
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

export const revenueType = [
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

export const donationType = [
	{
		label: "Cash Cab",
		value: "cashCab",
	},
	{
		label: "General",
		value: "general",
	},
];

export const expenseType = [
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

export const primaryColor = {
	DEFAULT: "#fcd34d",
	light: "#fef3c7",
	dark: "#d97706",
};
