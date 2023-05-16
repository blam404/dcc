"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	SliderProvider,
	SliderButton,
	SliderTrack,
	Slide,
} from "@faceless-ui/slider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function LatestRelease() {
	const [latest, setLatest] = useState([]);

	useEffect(() => {
		getLatest();
	}, []);

	const getLatest = async () => {
		await axios.get("/api/getLatest").then((res) => {
			const latest = JSON.parse(res.data).latest.filter(
				(song, index) => index <= 4
			);
			setLatest(latest);
		});
	};

	// sample for embedding
	// https://w.soundcloud.com/player/?visual=true&url=${music.url}&show_artwork=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false

	return (
		<SliderProvider
			scrollSnap={true}
			autoPlay={true}
			autoplaySpeed={3500}
			slidesToShow={1}
			scrollable={false}
			pauseOnHover={true}
		>
			<div className="relative pt-[56px]">
				<SliderTrack
					style={{ overflowX: "hidden", minHeight: "70vh" }}
					className="bg-gray-400"
				>
					{latest.map((music, index) => (
						<Slide
							index={index}
							key={index}
							role="group"
							className="flex justify-center"
						>
							<iframe
								className="w-full h-full"
								scrolling="no"
								frameBorder="no"
								src={`https://w.soundcloud.com/player/?visual=true&url=${music.url}&show_artwork=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
							/>
						</Slide>
					))}
				</SliderTrack>
			</div>
			<div className="absolute right-0 bg-amber-300">
				<SliderButton
					direction="prev"
					className="mx-2 p-2 transition duration-200 text-white/30 hover:text-white"
				>
					<FaArrowLeft />
				</SliderButton>
				<SliderButton
					direction="next"
					className="mx-2 p-2 transition duration-200 text-white/30 hover:text-white"
				>
					<FaArrowRight />
				</SliderButton>
			</div>
		</SliderProvider>
	);
}
