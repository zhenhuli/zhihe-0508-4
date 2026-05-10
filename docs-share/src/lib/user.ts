import { cookies } from "next/headers";

const USER_ID_COOKIE_NAME = "docs_share_user_id";

export function getCurrentUserId(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(USER_ID_COOKIE_NAME)?.value;
}
