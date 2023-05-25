"use client";

import React from "react";
import { useJumplist } from "@faceless-ui/jumplist";

export default function SectionNav({ sections }) {
	const { scrollToID } = useJumplist();
	return (
		<div className="fixed right-0 top-[15%] bg-white border border-right-0 p-5 drop-shadow-lg max-w-xs">
			<h2 className="text-xl underline">Sections</h2>
			<ol>
				{sections?.map((section, index) => (
					<li key={index}>
						<button
							className="text-left"
							onClick={() => scrollToID(`section-${index}`)}
						>
							- {section.blockName}
						</button>
					</li>
				))}
			</ol>
		</div>
	);
}
