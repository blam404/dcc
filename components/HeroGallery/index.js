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
	speed = 3500,
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
			<div className="relative py-[56px]">
				<SliderTrack style={{ overflowX: "hidden" }} className="">
					{images.map((image, index) => (
						<Slide index={index} key={index} role="group">
							<Image
								src={image}
								alt="Downtown Cap Co Slideshow"
								width="0"
								height="0"
								sizes="100vw"
								className="w-full"
							/>
						</Slide>
					))}
				</SliderTrack>
			</div>
		</SliderProvider>
	);
}
