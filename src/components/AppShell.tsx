import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, Mail, ListChecks, BookOpenText, Menu, Moon, Sun, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import tent from "@/assets/logo/tent.png";
import diamonds from "@/assets/logo/diamonds.png";
import campus from "@/assets/logo/campus.png";
import one from "@/assets/logo/one.png";
import protractor from "@/assets/logo/protractor.png";
import ground from "@/assets/logo/ground.png";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/planner", label: "AI Task Planner", icon: ListChecks },
  { to: "/research", label: "AI Research Assistant", icon: BookOpenText },
] as const;

function Mark() {
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-card p-0.5">
      <div className="relative aspect-[1600/1533] w-full translate-y-0.5">
        {[ground, tent, protractor, diamonds, campus, one].map((s, i) => (
          <img key={i} src={s} alt="" className="absolute inset-0 h-full w-full scale-[1.45] origin-[50%_42%]" />
        ))}
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: true }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-primary data-[status=active]:text-sidebar-primary-foreground"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar py-5 text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5">
        <Mark />
        <div className="min-w-0 leading-tight">
          <p className="font-display text-base font-semibold text-sidebar-accent-foreground">
            Campus<span className="text-sidebar-primary">One</span>
          </p>
          <p className="text-xs text-sidebar-foreground/60">AI Workplace Assistant</p>
        </div>
      </div>
      <NavList onNavigate={onNavigate} />
      <div className="mx-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/75">
        <p className="mb-1 flex items-center gap-1.5 font-semibold text-sidebar-accent-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-sidebar-primary" /> Responsible AI
        </p>
        AI can be wrong. Review, edit and verify every output before you use it.
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("co-theme", next ? "dark" : "light");
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle dark mode">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <SidebarInner />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-0 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarInner onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
