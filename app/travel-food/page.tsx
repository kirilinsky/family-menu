import Link from "next/link";
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
      <CardGrid />
    </PageLayout>
  );
}
