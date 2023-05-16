"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function ArtistList() {
	const [artists, setArtists] = useState([]);

	useEffect(() => {
		const getArtists = async () => {
			await axios.get("/api/getArtists").then((res) => {
				setArtists(JSON.parse(res.data).artists);
			});
		};
		getArtists();
	}, []);

	return (
		<div className="flex justify-center items-center flex-wrap">
			{artists.map((artist, index) => (
				<div key={index} className="w-1/4 cursor-pointer relative">
					<Link href={`/artist/${artist.slug}`}>
						<div>
							<Image
								src={artist.profilePic}
								alt={`${artist.name}'s profile picture`}
								width="0"
								height="0"
								sizes="50vw"
								className="w-full"
							/>
						</div>
						<div className="absolute inset-0 opacity-0 hover:opacity-100 hover:bg-amber-300/80 text-white text-3xl flex items-center justify-center transition duration-300">
							{artist.name.toUpperCase()}
						</div>
					</Link>
				</div>
			))}
		</div>
	);
}
