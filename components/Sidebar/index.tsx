"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/travel-food", label: "Travel Food" },
  { href: "/domestic-food", label: "Domestic Food" },
];

const Sidebar = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();

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

      <div className="mt-auto flex flex-col gap-1">
        {isAdmin && (
          <div className="px-3 py-1 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Admin
          </div>
        )}
        {isLoaded &&
          (isSignedIn ? (
            <SignOutButton>
              <Button variant="outline" className="justify-start">
                <LogOut /> Sign out
              </Button>
            </SignOutButton>
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" className="justify-start">
                <LogIn /> Sign in
              </Button>
            </SignInButton>
          ))}
      </div>
    </nav>
  );
};

export default Sidebar;
