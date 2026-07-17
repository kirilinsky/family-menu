import "server-only";
import { auth } from "@clerk/nextjs/server";

// Single-admin model: the Clerk user whose id matches ADMIN_USER_ID is admin.
export type Session = {
  userId: string;
  isAdmin: boolean;
};

export async function getSession(): Promise<Session | null> {
  const { userId } = await auth();
  if (!userId) return null;
  return { userId, isAdmin: userId === process.env.ADMIN_USER_ID };
}
