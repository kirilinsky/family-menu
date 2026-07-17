import Link from "next/link";
import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { listDishes } from "@/lib/dishes-db";

export default async function TravelFood() {
  const [session, dishes] = await Promise.all([getSession(), listDishes("travel")]);

  return (
    <PageLayout
      title="Travel Food"
      action={
        session?.isAdmin ? (
          <Button asChild>
            <Link href="/add-dish?type=travel">Add dish</Link>
          </Button>
        ) : undefined
      }
    >
      <DishGrid dishes={dishes} withStatusFilter />
    </PageLayout>
  );
}
