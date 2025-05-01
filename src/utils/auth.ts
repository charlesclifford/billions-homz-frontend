import { TOKEN_NAME } from "@/constants/app.constant";
import { config } from "@/utils/config";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "../lib/prisma";
import { NextRequest } from "next/server";

const JWT_SECRET = config.JWT_SECRET;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(
  payload: JwtPayload & { email: string; role: string }
): string {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return token;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload as {
      sub: string;
      email: string;
      role: string;
    };

    if (!decoded.sub) {
      console.log("Token is missing the 'id' field.");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_NAME, token, {
    path: "/",
    expires: 10,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Checks if the request is authenticated.
 * Returns the user ID if valid, otherwise returns null.
 */
export async function authCheck(req: NextRequest): Promise<string | null> {
  // Extract token from headers or cookies
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return null; // No token found
  }

  // Verify the token
  const decoded = verifyToken(token);
  if (!decoded?.sub) {
    return null; // Invalid token
  }

  // Check if the user exists in the database
  const user = await prisma.user.findUnique({
    where: { id: decoded?.sub },
    select: { id: true }, // Only fetch the user ID
  });

  if (!user) {
    return null; // User not found
  }

  return user.id; // Return the user ID
}
