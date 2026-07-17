import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";

// Belt 3: last-line wrapper — renders children only for an admin session.
const AdminOnly = async ({ children }: { children: ReactNode }) => {
  const session = await getSession();
  if (!session?.isAdmin) return null;
  return <>{children}</>;
};

export default AdminOnly;
