import React from "react";
import axios from "axios";
import HeroGallery from "@/components/HeroGallery";
import {
	InstagramBlock,
	SoundcloudBlock,
	TwitchBlock,
	TiktokBlock,
	TwitterBlock,
	YoutubeBlock,
} from "@/components/SocialBlocks";
import path from "path";
import { promises as fs } from "fs";

const jsonDirectory = path.join(process.cwd(), "data");
const fileContents = async () => {
	return await fs.readFile(jsonDirectory + "/artists.json", "utf8");
};

// export async function generateStaticParams() {
// 	const artists = await axios
// 		.get("http://localhost:3000/api/getArtists")
// 		.then((res) => {
// 			return JSON.parse(res.data).artists;
// 		});

// 	return artists.map((artist) => {
// 		return {
// 			slug: artist.slug,
// 		};
// 	});
// }

export async function generateStaticParams() {
	const data = await fileContents();
	const { artists } = await JSON.parse(data);
	return artists.map((artist) => {
		return {
			slug: artist.slug,
		};
	});
}

export default async function Artist({ params }) {
	//use this format to put songs on list
	//https://w.soundcloud.com/player/?visual=true&url=[INSERT_URL]&show_artwork=true

	// const artist = await axios
	// 	.get("http://localhost:3000/api/getArtists")
	// 	.then((res) => {
	// 		const artists = JSON.parse(res.data).artists;
	// 		return artists.find((artist) => artist.slug === params.slug);
	// 	});
	const data = await fileContents();
	const { artists } = await JSON.parse(data);

	const artist = artists.find((art) => art.slug === params.slug);

	return (
		<main>
			<HeroGallery />
			<div className="container mx-auto">
				<div className="flex justify-center">
					Insert cool photos of the artist in the slideshow.
				</div>
				<div className="text-4xl text-center pt-8">
					<h1>{artist.name}</h1>
				</div>
				<div className="flex justify-center pt-4">
					{artist.socials.instagram && (
						<InstagramBlock link={artist.socials.instagram} />
					)}
					{artist.socials.soundcloud && (
						<SoundcloudBlock link={artist.socials.soundcloud} />
					)}
					{artist.socials.tiktok && (
						<TiktokBlock link={artist.socials.tiktok} />
					)}
					{artist.socials.twitch && (
						<TwitchBlock link={artist.socials.twitch} />
					)}
					{artist.socials.twitter && (
						<TwitterBlock link={artist.socials.twitter} />
					)}
					{artist.socials.youtube && (
						<YoutubeBlock link={artist.socials.youtube} />
					)}
				</div>
				<div className="flex justify-center mb-8">
					These links do not work. Just an example of what it could
					be.
				</div>
				<p>Character Bio goes here</p>
				<p className="mb-4">{artist.bio}</p>
			</div>

			<div className="container mx-auto">
				<div className="mb-4">
					<h2 className="text-2xl">Latest Releases</h2>
					<p>The latest five releases from the artist will go here</p>
				</div>
				<div className="mb-4">
					<iframe
						width="100%"
						height="166"
						scrolling="no"
						frameBorder="no"
						allow="autoplay"
						src="https://w.soundcloud.com/player/?url=https://soundcloud.com/bigjd/let-it-go-ft-winnie"
					></iframe>
				</div>
				<div className="mb-4">
					<iframe
						width="100%"
						height="166"
						scrolling="no"
						frameBorder="no"
						allow="autoplay"
						src="https://w.soundcloud.com/player/?url=https://soundcloud.com/404echorp/floor404"
					></iframe>
				</div>
				<div className="mb-4">
					<iframe
						width="100%"
						height="166"
						scrolling="no"
						frameBorder="no"
						allow="autoplay"
						src="https://w.soundcloud.com/player/?url=https://soundcloud.com/hartlezzsc/heavy-on-my-mind"
					/>
				</div>
				<div className="mb-4">
					<iframe
						width="100%"
						height="166"
						scrolling="no"
						frameBorder="no"
						allow="autoplay"
						src="https://w.soundcloud.com/player/?url=https://soundcloud.com/kylobanks/loner"
					></iframe>
				</div>
				<div className="mb-4">
					<iframe
						width="100%"
						height="166"
						scrolling="no"
						frameBorder="no"
						allow="autoplay"
						src="https://w.soundcloud.com/player/?url=https://soundcloud.com/user-329168984/lil-phil-opps-in-the-air-prod-light"
					></iframe>
				</div>
			</div>
		</main>
	);
}
