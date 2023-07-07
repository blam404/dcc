// additional types used by Payload that isn't auto generated
import { Transaction } from "./Payload.types";

export type Meta = {
	docs: Transaction[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page?: number | null;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage?: number | null;
	nextPage?: number | null;
};
