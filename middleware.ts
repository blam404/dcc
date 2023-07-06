import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const { origin, host } = req.nextUrl;
	const token = req.cookies.get("payload-token");
	const roles = req.cookies.get("payload-roles");

	if (pathname.includes("/login") && token?.value) {
		return NextResponse.redirect(`${origin}/employee/dashboard`);
	} else if (
		pathname.includes("/employee/accounts") &&
		roles?.value !== "admin" &&
		roles?.value !== "editor"
	) {
		return NextResponse.redirect(`${origin}/employee/dashboard`);
	} else if (
		pathname.includes("/employee/") &&
		roles?.value !== "admin" &&
		roles?.value !== "editor" &&
		roles?.value !== "employee"
	) {
		return NextResponse.redirect(`${origin}/login`);
	} else {
		NextResponse.next();
	}
}

export const config = {
	matcher: ["/login", "/employee/:path*"],
};
