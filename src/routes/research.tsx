import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, FieldLabel, GenerateButton, OutputPanel } from "@/components/OutputPanel";
import { Textarea } from "@/components/ui/textarea";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — CampusOne AI" },
      { name: "description", content: "Summarise topics, extract key insights, get recommendations and simplify complex information." },
      { property: "og:title", content: "AI Research Assistant — CampusOne AI" },
      { property: "og:description", content: "Summaries, key insights and plain-language explanations in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const MODES = ["Topic overview", "Summarise my content"] as const;

function ResearchPage() {
  const g = useGenerate("research");
  const [mode, setMode] = useState<(typeof MODES)[number]>("Topic overview");
  const [content, setContent] = useState("");
  return (
    <AppShell title="AI Research Assistant">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (content.trim()) g.generate({ mode, content });
          }}
        >
          <div>
            <FieldLabel>Mode</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${mode === m ? "border-brand bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="content">{mode === "Topic overview" ? "Topic or question" : "Paste text to analyse"}</FieldLabel>
            <Textarea id="content" required value={content} onChange={(e) => setContent(e.target.value)} className="min-h-56"
              placeholder={mode === "Topic overview" ? "e.g. How can hybrid work improve team productivity?" : "Paste an article, report or notes…"} />
          </div>
          <GenerateButton loading={g.loading}>Analyse</GenerateButton>
          <Disclaimer />
        </form>
        <OutputPanel {...g} />
      </div>
    </AppShell>
  );
}
