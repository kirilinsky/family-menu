import Link from "next/link";
import DishGrid from "@/components/DishGrid";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { DOMESTIC_DISHES } from "@/lib/dishes";

export default async function DomesticFood() {
  const session = await getSession();

  return (
    <PageLayout
      title="Domestic Food"
      action={
        session?.isAdmin ? (
          <Button asChild>
            <Link href="/add-dish?type=domestic">Add dish</Link>
          </Button>
        ) : undefined
      }
    >
      <DishGrid dishes={DOMESTIC_DISHES} />
    </PageLayout>
  );
}
