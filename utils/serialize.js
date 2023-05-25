//This is used to convert the RichText from Payload to HTML

import React, { Fragment } from "react";
import escapeHTML from "escape-html";
import { Text } from "slate";

const serialize = (children) => {
	const rendered = children?.map((node, i) => {
		if (Text.isText(node)) {
			let text = (
				<span
					dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }}
				/>
			);

			if (node.bold) {
				text = <strong key={i}>{text}</strong>;
			}

			if (node.code) {
				text = <code key={i}>{text}</code>;
			}

			if (node.italic) {
				text = <em key={i}>{text}</em>;
			}

			// Handle other leaf types here...

			return <Fragment key={i}>{text}</Fragment>;
		}

		if (!node) {
			return null;
		}

		switch (node.type) {
			case "h1":
				return (
					<h1 key={i} className="text-4xl my-4">
						{serialize(node.children)}
					</h1>
				);
			// Iterate through all headings here...
			case "h2":
				return (
					<h2 key={i} className="text-3xl my-4">
						{serialize(node.children)}
					</h2>
				);
			case "h3":
				return (
					<h3 key={i} className="text-2xl my-4">
						{serialize(node.children)}
					</h3>
				);
			case "h4":
				return (
					<h4 key={i} className="text-xl my-4">
						{serialize(node.children)}
					</h4>
				);
			case "h5":
				return (
					<h5 key={i} className="text-lg my-4">
						{serialize(node.children)}
					</h5>
				);
			case "h6":
				return (
					<h6 key={i} className="font-bold my-4">
						{serialize(node.children)}
					</h6>
				);
			case "blockquote":
				return (
					<blockquote key={i}>{serialize(node.children)}</blockquote>
				);
			case "ul":
				return <ul key={i}>{serialize(node.children)}</ul>;
			case "ol":
				return <ol key={i}>{serialize(node.children)}</ol>;
			case "li":
				return (
					<li key={i} className="mb-2">
						{serialize(node.children)}
					</li>
				);
			case "link":
				return (
					<a
						href={escapeHTML(node.url)}
						key={i}
						target="_blank"
						rel="noreferrer"
					>
						<u>{serialize(node.children)}</u>
					</a>
				);

			default:
				return <p key={i}>{serialize(node.children)}</p>;
		}
	});
	return rendered;
};

export default serialize;
