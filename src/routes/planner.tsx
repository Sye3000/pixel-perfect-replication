import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, FieldLabel, GenerateButton, OutputPanel } from "@/components/OutputPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — CampusOne AI" },
      { name: "description", content: "Turn your task list into a prioritised daily or weekly plan by urgency, importance and deadline." },
      { property: "og:title", content: "AI Task Planner — CampusOne AI" },
      { property: "og:description", content: "Prioritised daily and weekly plans based on urgency, importance and deadlines." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const g = useGenerate("planner");
  const [horizon, setHorizon] = useState<"Daily" | "Weekly">("Daily");
  const [hours, setHours] = useState("08:00–17:00");
  const [tasks, setTasks] = useState("");
  return (
    <AppShell title="AI Task Planner">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (tasks.trim()) g.generate({ horizon, hours, tasks });
          }}
        >
          <div>
            <FieldLabel>Plan type</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {(["Daily", "Weekly"] as const).map((h) => (
                <button type="button" key={h} aria-pressed={horizon === h} onClick={() => setHorizon(h)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${horizon === h ? "border-brand bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="hrs">Working hours</FieldLabel>
            <Input id="hrs" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="tasks">Tasks (one per line, add deadlines / urgency)</FieldLabel>
            <Textarea id="tasks" required value={tasks} onChange={(e) => setTasks(e.target.value)} className="min-h-48"
              placeholder={"Finish budget report — due today, urgent\nPrepare slides for Monday meeting\nReply to supplier emails\nTeam 1:1s — Wednesday"} />
          </div>
          <GenerateButton loading={g.loading}>Build my plan</GenerateButton>
          <Disclaimer />
        </form>
        <OutputPanel {...g} />
      </div>
    </AppShell>
  );
}
