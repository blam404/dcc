import React from "react";
import {
	FaInstagram,
	FaSoundcloud,
	FaTiktok,
	FaTwitch,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";

export function InstagramBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://instagram.com/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaInstagram className="h-6 w-6" />
			</a>
		</div>
	);
}

export function SoundcloudBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://soundcloud.com/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaSoundcloud className="h-6 w-6" />
			</a>
		</div>
	);
}

export function TiktokBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://tiktok.com/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaTiktok className="h-6 w-6" />
			</a>
		</div>
	);
}

export function TwitchBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://twitch.tv/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaTwitter className="h-6 w-6" />
			</a>
		</div>
	);
}

export function TwitterBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://twitter.com/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaTwitch className="h-6 w-6" />
			</a>
		</div>
	);
}

export function YoutubeBlock({ link }) {
	return (
		<div className="mx-2">
			<a
				href={`https://youtube.com/${link}`}
				target="_blank"
				rel="noreferrer"
			>
				<FaYoutube className="h-6 w-6" />
			</a>
		</div>
	);
}
