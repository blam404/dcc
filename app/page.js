"use client";

import About from "@/components/homePage/About";
import ArtistList from "@/components/homePage/ArtistList";
import LatestRelease from "@/components/homePage/LatestRelease";
import React from "react";
import { JumplistNode } from "@faceless-ui/jumplist";

export default function Home() {
	//notes:
	// change image fill and width/height depending on screen size
	// when md or higher, fill and object-cover and parent with min-h-screen
	// when lower than md, 1920x1080 or whatever and object-contain
	return (
		<main>
			<JumplistNode nodeID="latest">
				<LatestRelease />
			</JumplistNode>
			<div className="container m-auto">
				<JumplistNode
					nodeID="about"
					className="min-h-screen w-full flex items-center"
				>
					<About />
				</JumplistNode>
				<JumplistNode
					nodeID="artists"
					className="min-h-screen w-full flex items-center"
				>
					<ArtistList />
				</JumplistNode>
			</div>
		</main>
	);
}
