import React from "react";

export default function Footer() {
	return (
		<div className="w-full bg-amber-300">
			<div className="flex flex-wrap flex-col justify-center items-center container mx-auto pt-10 pb-12">
				<div>
					<h3 className="text-2xl">Contact Us</h3>
				</div>
				<div className="text-center">
					<strong>CEO</strong>: Malcom Delacroix | (323) 555-5555
				</div>
				<div className="text-center">
					<strong>Web Dev</strong>: Morgan Man | (485) 529-8012 |
					PrototypeM#2692
				</div>
				<div className="mt-4 text-sm">
					Copyright 2023 Downtown Cap Co.
				</div>
			</div>
		</div>
	);
}
