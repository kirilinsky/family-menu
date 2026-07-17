import Link from "next/link";
import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { DOMESTIC_DISHES } from "@/lib/dishes";

export default function DomesticFood() {
  return (
    <PageLayout
      title="Domestic Food"
      action={
        <Button asChild>
          <Link href="/add-dish?type=domestic">Add dish</Link>
        </Button>
      }
    >
      <DishGrid dishes={DOMESTIC_DISHES} />
    </PageLayout>
  );
}
