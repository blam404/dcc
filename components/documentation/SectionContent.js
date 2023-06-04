"use client";

import React from "react";
import { JumplistNode } from "@faceless-ui/jumplist";
import serialize from "../../utils/serialize";

export default function SectionContent({ section, index }) {
	return (
		<JumplistNode nodeID={`section-${index}`}>
			<h2 className="text-3xl mb-4">{section.blockName}</h2>
			{section.sectionContent?.map((content, contentIndex) => {
				return (
					<div className="mb-4" key={contentIndex}>
						{serialize(content.children)}
					</div>
				);
			})}
		</JumplistNode>
	);
}
