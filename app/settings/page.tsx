import { redirect } from "next/navigation";
import { listCategories } from "@/app/actions/categories";
import AdminOnly from "@/components/AdminOnly";
import CategoryEditor from "@/components/CategoryEditor";
import PageLayout from "@/components/PageLayout";
import { getSession } from "@/lib/auth";

export default async function Settings() {
  // Belt 2: middleware already gated this route; re-check server-side.
  const session = await getSession();
  if (!session?.isAdmin) redirect("/");

  const categories = await listCategories();

  return (
    <PageLayout title="Settings">
      <AdminOnly>
        <CategoryEditor initial={categories} />
      </AdminOnly>
    </PageLayout>
  );
}
