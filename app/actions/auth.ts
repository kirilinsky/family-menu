"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_TOKEN, SESSION_COOKIE } from "@/lib/auth";

// DEV-ONLY fake login: unconditionally grants admin. Replace with real auth.
export async function fakeLogin() {
  const store = await cookies();
  store.set(SESSION_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  revalidatePath("/", "layout");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  revalidatePath("/", "layout");
  redirect("/");
}
