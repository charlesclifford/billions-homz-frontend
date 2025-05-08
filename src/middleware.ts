// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_NAME, USER_DETAILS } from "./constants/app.constant";
import { IUser } from "./interfaces/user.interface";

const adminRoutes = ["/admin", "/admin/*"];
const privateRoutes = ["/profile"];
const authRoutes = ["/auth/login", "/auth/register", "/auth/*"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for unauthorized page to prevent redirect loops
  if (pathname.startsWith("/admin/unauthorized")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_NAME)?.value;
  const userCookie = req.cookies.get(USER_DETAILS)?.value;

  let user: IUser | null = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie) as IUser;
    } catch (error) {
      console.error("Failed to parse user details:", error);
      // Clear invalid user cookie
      const response = NextResponse.next();
      response.cookies.delete(USER_DETAILS);
      return response;
    }
  }

  console.log("from middleware>>>", {
    token,
    user,
  });

  console.log(`Middleware check - Path: ${pathname}, Role: ${user?.role}`);

  // Redirect authenticated users from auth routes to homepage
  if (authRoutes.some(route => pathname.startsWith(route))) {
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
    if (!["super_admin", "admin"].includes(user?.role as string)) {
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
