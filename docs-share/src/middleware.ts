import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const USER_ID_COOKIE_NAME = "docs_share_user_id";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const userId = request.cookies.get(USER_ID_COOKIE_NAME)?.value;

  if (!userId) {
    const newUserId = uuidv4();
    response.cookies.set(USER_ID_COOKIE_NAME, newUserId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
