import Link from "next/link";
import PageLayout, { CardGrid } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";

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
      <CardGrid />
    </PageLayout>
  );
}
