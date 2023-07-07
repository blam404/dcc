import React from "react";
import "./globals.scss";

import Footer from "../../components/Footer";
import Nav from "../../components/Nav";
import Providers from "../../components/Providers";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Nav />
					<main>
						<div
							className="container mx-auto pt-24 pb-8 px-4 md:px-0"
							style={{ minHeight: "calc(100vh - 204px" }}
						>
							{children}
						</div>
					</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
