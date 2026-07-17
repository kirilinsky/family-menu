import PageLayout from "@/components/PageLayout";

export default async function AddDish({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const isTravel = type === "travel";

  return (
    <PageLayout title="Add Dish">
      {/* form goes here; isTravel decides target list */}
      <div data-type={isTravel ? "travel" : "domestic"} />
    </PageLayout>
  );
}
