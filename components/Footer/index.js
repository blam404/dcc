import React from "react";

export default function Footer() {
	return (
		<div className="mt-24 w-full bg-slate-700 text-amber-300">
			<div className="flex flex-wrap flex-col justify-center items-center container mx-auto pt-10 pb-12">
				<div>
					<h3 className="text-2xl">Contact Us</h3>
				</div>
				<div>
					<strong>CEO</strong>: FirstName LastName | (555) 123-4567 |
					discord#1234
				</div>
				<div>
					<strong>Web Design</strong>: FirstName LastName | (555)
					123-4567 | discord#1234
				</div>
				<div>
					<strong>Web Developer</strong>: Morgan Man | (555) 123-4567
					| PrototypeM#2692
				</div>
				<div className="mt-4 text-sm">
					Copyright 2023 ERP Recordings, LLC
				</div>
			</div>
		</div>
	);
}
