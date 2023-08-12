import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function PageLoading() {
	return (
		<div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
			<FaSpinner className="animate-spin h-12 w-12" />
		</div>
	);
}
