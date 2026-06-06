import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {

  const token =
    request.cookies.get("token");

  const userCookie =
    request.cookies.get("user");

  const pathname =
    request.nextUrl.pathname;

  if (!token) {

    if (
      pathname.startsWith("/candidate") ||
      pathname.startsWith("/recruiter") ||
      pathname.startsWith("/saved-jobs")
    ) {

      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );

    }

    return NextResponse.next();

  }

  if (!userCookie) {

    return NextResponse.next();

  }

  try {

    const user =
      JSON.parse(
        decodeURIComponent(
          userCookie.value
        )
      );

    if (
      pathname.startsWith("/recruiter") &&
      user.role !== "recruiter"
    ) {

      return NextResponse.redirect(
        new URL(
          "/",
          request.url
        )
      );

    }

    if (
      pathname.startsWith("/candidate") &&
      user.role !== "candidate"
    ) {

      return NextResponse.redirect(
        new URL(
          "/",
          request.url
        )
      );

    }

  } catch (error) {

    console.log(error);

  }

  return NextResponse.next();

}
export const config = {
  matcher: [
    "/candidate/:path*",
    "/recruiter/:path*",
    "/saved-jobs/:path*",
    "/recruiter-dashboard/:path*"
  ]
};