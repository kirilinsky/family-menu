import { redirect } from "next/navigation";
import {
  createCategory,
  deleteCategory,
  listCategories,
  renameCategory,
} from "@/app/actions/categories";
import { createCuisine, deleteCuisine, listCuisines, renameCuisine } from "@/app/actions/cuisines";
import AdminOnly from "@/components/AdminOnly";
import PageLayout from "@/components/PageLayout";
import TaxonomyEditor from "@/components/TaxonomyEditor";
import { getSession } from "@/lib/auth";

export default async function Settings() {
  // Belt 2: middleware already gated this route; re-check server-side.
  const session = await getSession();
  if (!session?.isAdmin) redirect("/");

  const [categories, cuisines] = await Promise.all([listCategories(), listCuisines()]);

  return (
    <PageLayout title="Settings">
      <AdminOnly>
        <div className="flex flex-wrap items-start gap-8">
          <TaxonomyEditor
            title="Categories"
            initial={categories}
            onCreate={createCategory}
            onRename={renameCategory}
            onDelete={deleteCategory}
          />
          <TaxonomyEditor
            title="Cuisines"
            initial={cuisines}
            onCreate={createCuisine}
            onRename={renameCuisine}
            onDelete={deleteCuisine}
          />
        </div>
      </AdminOnly>
    </PageLayout>
  );
}
