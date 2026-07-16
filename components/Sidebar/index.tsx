"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/travel-food", label: "Travel Food" },
  { href: "/domestic-food", label: "Domestic Food" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-4">
      <div className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        PadMenu
      </div>
      {links.map(({ href, label }) => (
        <Button
          key={href}
          asChild
          variant="ghost"
          className={cn(
            "justify-start text-sidebar-foreground",
            pathname === href &&
              "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );
};

export default Sidebar;
