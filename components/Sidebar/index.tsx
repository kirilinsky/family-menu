"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignOutButton, useAuth } from "@clerk/nextjs";
import { LogIn, LogOut, Menu, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/travel-food", label: "Travel Food" },
  { href: "/domestic-food", label: "Domestic Food" },
];

const Sidebar = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-sidebar-border bg-sidebar p-4 md:hidden">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          PadMenu
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 -translate-x-full flex-col gap-1 border-r border-sidebar-border bg-sidebar p-4 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0",
          open && "translate-x-0"
        )}
      >
        <div className="hidden px-3 py-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground md:block">
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
            onClick={() => setOpen(false)}
          >
            <Link href={href}>{label}</Link>
          </Button>
        ))}

        <div className="mt-auto flex flex-col gap-1">
          {isAdmin && (
            <>
              <div className="px-3 py-1 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                Admin
              </div>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "justify-start text-sidebar-foreground",
                  pathname === "/settings" &&
                    "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                <Link href="/settings">
                  <Settings /> Settings
                </Link>
              </Button>
            </>
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
    </>
  );
};

export default Sidebar;
