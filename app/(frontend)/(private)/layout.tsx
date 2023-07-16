import React from "react";
import "../globals.scss";

import Providers from "~components/Providers";
import Layout from "~components/private/Layout";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<main>
						<Layout>{children}</Layout>
					</main>
				</Providers>
			</body>
		</html>
	);
}
