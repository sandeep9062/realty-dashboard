import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // Better Auth session check
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    // If no session and trying to access dashboard, redirect to login
    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Matcher ensures this only runs on dashboard routes to save performance
export const config = {
    matcher: ["/dashboard/:path*"],
};