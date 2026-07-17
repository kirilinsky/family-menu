import DishForm from "@/components/DishForm";
import PageLayout from "@/components/PageLayout";

export default async function AddDish({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const variant = type === "travel" ? "travel" : "domestic";

  return (
    <PageLayout title="Add Dish">
      <DishForm variant={variant} />
    </PageLayout>
  );
}
