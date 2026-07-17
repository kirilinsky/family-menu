import "server-only";
import { cookies } from "next/headers";

// DEV-ONLY fake auth. The cookie is a plain marker anyone can forge —
// replace with a real signed session (auth provider / JWT) before deploy.
export const SESSION_COOKIE = "padmenu_session";
export const ADMIN_TOKEN = "admin-dev";

export type Session = {
  isAdmin: boolean;
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return { isAdmin: token === ADMIN_TOKEN };
}
