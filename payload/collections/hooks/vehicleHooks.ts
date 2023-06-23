import { CollectionBeforeChangeHook } from "payload/types";

export const combinedName: CollectionBeforeChangeHook = async ({ data }) => {
	if (!data.combinedName) {
		data.combinedName = `${data.vehicle} - ${data.licensePlate}`;
	}
	return data;
};
