import React, { Fragment } from "react";
import { getPayloadClient } from "../../../../payload/payloadClient";
import SectionContent from "../../../../components/documentation/SectionContent";
import SectionNav from "../../../../components/documentation/SectionNav";

export async function generateStaticParams() {
	const payload = await getPayloadClient();

	const documents = await payload.find({
		collection: "documentation",
		limit: 0,
	});

	return documents.docs.map((document) => {
		return {
			id: document.id,
		};
	});
}

export default async function Document({ params }) {
	const payload = await getPayloadClient();

	const document = await payload.findByID({
		collection: "documentation",
		id: params.id,
	});

	return (
		<div className="relative">
			<div className="w-3/4">
				<h1 className="text-4xl mb-4">{document.title}</h1>
				{document?.sections?.map((section, index) => {
					return (
						<Fragment key={index}>
							<SectionContent section={section} index={index} />
						</Fragment>
					);
				})}
			</div>
			{document?.sections?.length > 1 && (
				<SectionNav sections={document.sections} />
			)}
		</div>
	);
}
