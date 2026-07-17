import Link from "next/link";
import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { TRAVEL_DISHES } from "@/lib/dishes";

export default function TravelFood() {
  return (
    <PageLayout
      title="Travel Food"
      action={
        <Button asChild>
          <Link href="/add-dish?type=travel">Add dish</Link>
        </Button>
      }
    >
      <DishGrid dishes={TRAVEL_DISHES} />
    </PageLayout>
  );
}
