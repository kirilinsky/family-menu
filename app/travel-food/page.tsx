import Link from "next/link";
import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { TRAVEL_DISHES } from "@/lib/dishes";

export default async function TravelFood() {
  const session = await getSession();

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
      <DishGrid dishes={TRAVEL_DISHES} />
    </PageLayout>
  );
}
