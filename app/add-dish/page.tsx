import { redirect } from "next/navigation";
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

  return (
    <PageLayout title="Add Dish">
      <AdminOnly>
        <DishForm variant={variant} />
      </AdminOnly>
    </PageLayout>
  );
}
