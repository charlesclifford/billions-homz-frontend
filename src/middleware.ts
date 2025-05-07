// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_NAME, USER_DETAILS } from "./constants/app.constant";
import { IUser } from "./interfaces/user.interface";

const adminRoutes = ["/admin"];
const privateRoutes = ["/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(TOKEN_NAME)?.value;
  const userCookie = req.cookies.get(USER_DETAILS)?.value;

  let user: IUser | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as IUser;
    } catch (error) {
      console.error("Failed to parse user details:", error);
    }
  }

  console.log("from middleware>>>", {
    token,
    user,
  });

  // Redirect authenticated users from auth routes to homepage
  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Handle private routes
  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check for /admin/members route - SUPER_ADMIN only
    if (pathname.startsWith("/admin/members")) {
      if (user?.role !== "super_admin") {
        return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    // Check for other admin routes - ADMIN or SUPER_ADMIN
    if (user?.role !== "super_admin" && user?.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
