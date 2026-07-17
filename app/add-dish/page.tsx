import { redirect } from "next/navigation";
import { listCategories } from "@/app/actions/categories";
import { listCuisines } from "@/app/actions/cuisines";
import AdminOnly from "@/components/AdminOnly";
import DishForm from "@/components/DishForm";
import PageLayout from "@/components/PageLayout";
import { getSession } from "@/lib/auth";

export default async function AddDish({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  // Belt 2: middleware already gated this route; re-check server-side.
  const session = await getSession();
  if (!session?.isAdmin) redirect("/");

  const { type } = await searchParams;
  const variant = type === "travel" ? "travel" : "domestic";
  const [categories, cuisines] = await Promise.all([listCategories(), listCuisines()]);

  return (
    <PageLayout title="Add Dish">
      <AdminOnly>
        <DishForm
          variant={variant}
          categories={categories.map((c) => c.name)}
          cuisines={cuisines.map((c) => c.name)}
        />
      </AdminOnly>
    </PageLayout>
  );
}
