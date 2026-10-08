import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ArrowRight, BookOpenText, ListChecks, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LogoAssemble } from "@/components/LogoAssemble";
import { Disclaimer } from "@/components/OutputPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CampusOne AI Workplace Productivity Assistant" },
      { name: "description", content: "Write emails, plan your tasks and research faster with CampusOne's AI workplace assistant." },
      { property: "og:title", content: "CampusOne AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Smart emails, prioritised plans and research summaries — reviewed by you." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", body: "Professional emails tailored to your audience — formal, informal or persuasive." },
  { to: "/planner", icon: ListChecks, title: "AI Task Planner", body: "Prioritised daily or weekly plans by urgency, importance and deadlines." },
  { to: "/research", icon: BookOpenText, title: "AI Research Assistant", body: "Summaries, key insights, recommendations and plain-language explanations." },
] as const;

function Index() {
  const [introComplete, setIntroComplete] = useState(false);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
  return (
    <>
    {!introComplete && (
      <section className="flex min-h-svh flex-col items-center justify-center bg-background px-8 py-12" aria-label="CampusOne intro">
        <LogoAssemble onComplete={finishIntro} className="w-full max-w-[360px]" />
        <h1 className="mt-10 text-center text-2xl font-semibold">CampusOne</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">AI Workplace Productivity Assistant</p>
      </section>
    )}
    <div hidden={!introComplete}>
    <AppShell title="Dashboard">
      <section className="grid items-center gap-8 rounded-3xl border bg-card p-6 shadow-card sm:p-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            AI Workplace Productivity Assistant
          </p>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Do your best work, <span className="text-brand">faster.</span>
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Three focused AI tools to write, plan and research — with every result editable so you stay in control.
          </p>
          <Link to="/email" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            Start with an email <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <LogoAssemble startAssembled className="mx-auto w-full max-w-[280px]" />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/50">
            <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <div className="mt-8"><Disclaimer /></div>
    </AppShell>
    </div>
    </>
  );
}
