import { CollectionBeforeChangeHook } from "payload/types";

export const addStartBalance: CollectionBeforeChangeHook = async ({ data }) => {
	if (!data.startingBalance) {
		data.startingBalance = data.balance;
	}
	return data;
};
