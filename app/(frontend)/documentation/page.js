"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Documentation() {
	const [show, setShow] = useState(false);
	const [documentation, setDocumentation] = useState([]);

	useEffect(() => {
		const getDocumentation = async () => {
			await axios.get("/api/documentation").then((res) => {
				const docs = res.data.docs.sort((a, b) => {
					if (a.title < b.title) {
						return -1;
					}
					if (a.title > b.title) {
						return 1;
					}
					return 0;
				});
				setDocumentation(docs);
				setShow(true);
			});
		};
		getDocumentation();
	}, []);

	return (
		<div>
			{show && (
				<>
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
				</>
			)}
		</div>
	);
}
