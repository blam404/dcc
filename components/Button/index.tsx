import React, { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
};

export default function Button({ children, className, ...rest }: Props) {
	return (
		<button
			className={`px-2 py-1 rounded-md bg-primary ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
