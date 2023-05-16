"use client";

import React from "react";
import "./globals.scss";
import { JumplistProvider } from "@faceless-ui/jumplist";
import { ModalProvider } from "@faceless-ui/modal";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<ModalProvider transitTime={250}>
					<JumplistProvider
						threshold={0.05}
						rootMargin="-100px 0px 0px 0px"
						smoothScroll
					>
						<Nav />
						{children}
						<Footer />
					</JumplistProvider>
				</ModalProvider>
			</body>
		</html>
	);
}
