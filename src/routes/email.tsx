import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, FieldLabel, GenerateButton, OutputPanel } from "@/components/OutputPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGenerate } from "@/hooks/use-generate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — CampusOne AI" },
      { name: "description", content: "Generate professional formal, informal or persuasive emails for any audience." },
      { property: "og:title", content: "Smart Email Generator — CampusOne AI" },
      { property: "og:description", content: "Generate professional emails with audience and tone options." },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Informal", "Persuasive"] as const;

function EmailPage() {
  const g = useGenerate("email");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [purpose, setPurpose] = useState("");
  return (
    <AppShell title="Smart Email Generator">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (purpose.trim()) g.generate({ audience, tone, purpose });
          }}
        >
          <div>
            <FieldLabel htmlFor="aud">Audience</FieldLabel>
            <Input id="aud" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. My line manager, a new client" />
          </div>
          <div>
            <FieldLabel>Tone</FieldLabel>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {TONES.map((t) => (
                <button
                  type="button"
                  key={t}
                  role="radio"
                  aria-checked={tone === t}
                  onClick={() => setTone(t)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition-colors ${tone === t ? "border-brand bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="pur">Purpose & key points</FieldLabel>
            <Textarea id="pur" required value={purpose} onChange={(e) => setPurpose(e.target.value)} className="min-h-40" placeholder="e.g. Request a deadline extension for the Q3 report to Friday because of system downtime." />
          </div>
          <GenerateButton loading={g.loading}>Generate email</GenerateButton>
          <Disclaimer />
        </form>
        <OutputPanel {...g} />
      </div>
    </AppShell>
  );
}
