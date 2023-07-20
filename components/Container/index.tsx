import React, { ReactNode } from "react";

type WrapperProps = {
	children: ReactNode;
	col: number;
	className?: string;
};

type BoxProps = {
	children: ReactNode;
	className?: string;
};

export function ContainerWrapper({
	children,
	col,
	className,
	...rest
}: WrapperProps) {
	const columns = {
		1: "grid-cols-1",
		2: "grid-cols-2",
		3: "grid-cols-3",
		4: "grid-cols-4",
		5: "grid-cols-5",
		6: "grid-cols-6",
		7: "grid-cols-7",
		8: "grid-cols-8",
		9: "grid-cols-9",
		10: "grid-cols-10",
		11: "grid-cols-11",
		12: "grid-cols-12",
	};
	return (
		<div className={`grid gap-4 ${columns[col]} ${className}`} {...rest}>
			{children}
		</div>
	);
}

export function ContainerBox({ children, className, ...rest }: BoxProps) {
	return (
		<div
			className={`p-4 bg-neutral-100 border border-neutral-300 rounded-md ${className}`}
			{...rest}
		>
			{children}
		</div>
	);
}
