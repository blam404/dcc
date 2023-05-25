"use client";

import React from "react";
import "./globals.scss";
import { JumplistProvider } from "@faceless-ui/jumplist";
import { ModalProvider } from "@faceless-ui/modal";

import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ModalProvider transitTime={250}>
					<JumplistProvider
						threshold={0.5}
						rootMargin="-100px 0px 0px 0px"
						smoothScroll
					>
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
					</JumplistProvider>
				</ModalProvider>
			</body>
		</html>
	);
}
