import { CollectionBeforeChangeHook } from "payload/types";

export const addStartBalance: CollectionBeforeChangeHook = async ({
	data,
	originalDoc,
}) => {
	if (
		originalDoc.startingBalance === null ||
		originalDoc.startingBalance === undefined
	) {
		data.startingBalance = data.balance;
	}
	return data;
};
