"use client";

import React from "react";
import Image from "next/image";
import {
	SliderProvider,
	SliderButton,
	SliderTrack,
	Slide,
} from "@faceless-ui/slider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function HeroGallery({
	images,
	speed = 2500,
	pauseOnHover = false,
}) {
	return (
		<SliderProvider
			scrollSnap={true}
			autoPlay={true}
			autoplaySpeed={speed}
			slidesToShow={1}
			scrollable={false}
			pauseOnHover={pauseOnHover}
		>
			<div className="relative pt-[56px]">
				<SliderTrack style={{ overflowX: "hidden" }} className="">
					<Slide index={0} role="group">
						<Image
							src="https://placehold.co/1920x720/purple/white.jpg"
							alt="hero image 1"
							priority={true}
							width="0"
							height="0"
							sizes="100vw"
							className="w-full"
						/>
					</Slide>
					<Slide index={1} role="group">
						<Image
							src="https://placehold.co/1920x720/blue/white.jpg"
							alt="hero image 2"
							priority={true}
							width="0"
							height="0"
							sizes="100vw"
							className="w-full"
						/>
					</Slide>
					<Slide index={2} role="group">
						<Image
							src="https://placehold.co/1920x720/red/white.jpg"
							alt="hero image 3"
							priority={true}
							width="0"
							height="0"
							sizes="100vw"
							className="w-full"
						/>
					</Slide>
				</SliderTrack>
				<div className="absolute bg-amber-300 right-0 -bottom-8">
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
			</div>
		</SliderProvider>
	);
}
