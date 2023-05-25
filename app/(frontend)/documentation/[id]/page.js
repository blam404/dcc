"use client";

import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { JumplistNode } from "@faceless-ui/jumplist";
import serialize from "../../../../utils/serialize";
import SectionNav from "../../../../components/documentation/SectionNav";

// export async function generateStaticParams() {
// 	const data = await fileContents();
// 	const { artists } = await JSON.parse(data);
// 	return artists.map((artist) => {
// 		return {
// 			slug: artist.slug,
// 		};
// 	});
// }

export default function Document({ params }) {
	const [document, setDocument] = useState({});
	const [show, setShow] = useState(false);

	useEffect(() => {
		const getDocument = async () => {
			await axios.get(`/api/documentation/${params.id}`).then((res) => {
				setDocument(res.data);
				setShow(true);
			});
		};
		getDocument();
	}, []);

	return (
		<div className="relative">
			{show && (
				<>
					<div className="w-3/4">
						<h1 className="text-4xl mb-4">{document.title}</h1>
						{document?.sections?.map((section, index) => {
							// console.log("section: ", section);
							return (
								<Fragment key={index}>
									<JumplistNode nodeID={`section-${index}`}>
										<h2 className="text-3xl mb-4">
											{section.blockName}
										</h2>
										{section?.sectionContent?.map(
											(content, contentIndex) => {
												// console.log("content: ", content);
												// console.log(
												// 	"content.children: ",
												// 	content.children
												// );
												return (
													<div
														className="mb-4"
														key={contentIndex}
													>
														{serialize(
															content?.children
														)}
													</div>
												);
											}
										)}
									</JumplistNode>
								</Fragment>
							);
						})}
					</div>
					{document.sections.length > 1 && (
						<SectionNav sections={document.sections} />
					)}
				</>
			)}
		</div>
	);
}
