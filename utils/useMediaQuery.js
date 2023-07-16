import { useState, useCallback, useEffect } from "react";

export default function useMediaQuery(width) {
	const [targetReached, setTargetReached] = useState();

	const updateTarget = useCallback(() => {
		const media = window.matchMedia(`(max-width: ${width}px)`);
		if (media.matches) {
			setTargetReached(false);
		} else {
			setTargetReached(true);
		}
	}, []);

	useEffect(() => {
		if (targetReached === undefined) {
			updateTarget();
		}
		window.addEventListener("resize", updateTarget);
		return () => window.removeEventListener("resize", updateTarget);
	}, []);

	return targetReached;
}

export const breakpoint = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	xxl: 1536,
};
