import Link from "next/link";
import DishCard from "@/components/DishCard";
import PageLayout, { CardGrid } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

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
      <CardGrid>
        {Array.from({ length: 4 }, (_, i) => (
          <DishCard key={i} />
        ))}
      </CardGrid>
    </PageLayout>
  );
}
