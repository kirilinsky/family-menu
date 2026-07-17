import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { listDishes } from "@/lib/dishes-db";

export default async function DomesticFood() {
  const dishes = await listDishes("domestic");

  return (
    <PageLayout title="Domestic Food">
      <DishGrid dishes={dishes} />
    </PageLayout>
  );
}
