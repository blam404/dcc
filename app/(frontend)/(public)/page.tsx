import React from "react";
import HeroGallery from "~components/HeroGallery";

export default function Home() {
	const images = [
		"/images/dtcc01.png",
		"/images/dtcc02.jpg",
		"/images/dtcc03.jpg",
		"/images/dtcc04.png",
		"/images/dtcc05.png",
		"/images/dtcc06.png",
	];

	return (
		<div>
			<p className="mb-4">
				Welcome to Downtown Cab Co! We are a vibrant and dynamic faction
				that is dedicated to providing top-notch transportation services
				to our clients. We are currently looking for new members to join
				our team and we will be posting job openings soon. If
				you&apos;re interested in becoming a part of our faction, feel
				free to contact us. We are looking for dedicated and hardworking
				individuals who are passionate about the transportation
				industry. Join us and be a part of something great!
			</p>
			<p>
				Please bare with us as our website is under construction. If you
				need to contact us, our information can be found at the bottom
				of the page.
			</p>
			<HeroGallery images={images} />
		</div>
	);
}
