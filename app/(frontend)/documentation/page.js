import React from "react";
import Link from "next/link";
import { getPayloadClient } from "~payload/payloadClient";

export default async function Documentation() {
	const payload = await getPayloadClient();

	const docs = await payload.find({
		collection: "documentation",
	});

	const documentation = docs.docs.sort((a, b) => {
		if (a.title < b.title) {
			return -1;
		}
		if (a.title > b.title) {
			return 1;
		}
		return 0;
	});

	return (
		<div>
			<h1 className="text-2xl mb-4">Documents</h1>
			<ul>
				{documentation.map((doc, index) => (
					<li key={index} className="mb-2">
						<Link href={`/documentation/${doc.id}`}>
							<u>{doc.title}</u>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
