import { CollectionBeforeChangeHook } from "payload/types";

export const addStartBalance: CollectionBeforeChangeHook = async ({ data }) => {
	if (data.startingBalance === null || data.startingBalance === undefined) {
		data.startingBalance = data.balance;
	}
	return data;
};
