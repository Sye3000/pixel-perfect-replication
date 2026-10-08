// Structured prompts: Role, Context, Task, Constraints, Output.
export type Feature = "email" | "planner" | "research";

const block = (p: { role: string; context: string; task: string; constraints: string[]; output: string }) =>
  `ROLE\n${p.role}\n\nCONTEXT\n${p.context}\n\nTASK\n${p.task}\n\nCONSTRAINTS\n${p.constraints.map((c) => `- ${c}`).join("\n")}\n\nOUTPUT FORMAT\n${p.output}`;

const clean = (v: unknown, max = 6000) => String(v ?? "").slice(0, max).trim();

export function buildPrompt(feature: Feature, input: Record<string, unknown>): string {
  if (feature === "email") {
    return block({
      role: "You are a senior workplace communications specialist who writes clear, professional emails.",
      context: `Audience: ${clean(input["audience"], 200)}\nTone: ${clean(input["tone"], 40)}\nPurpose / key points supplied by the user:\n${clean(input["purpose"])}`,
      task: "Write one complete email that achieves the purpose for the stated audience in the requested tone.",
      constraints: [
        "Formal: polite, precise, no slang. Informal: warm, friendly, conversational. Persuasive: benefit-led with a clear call to action.",
        "Keep it under 220 words unless the points require more.",
        "Do not invent facts, names, dates or figures; use [placeholders] where details are missing.",
      ],
      output: "Plain text only. First line: 'Subject: ...'. Then a blank line, greeting, body paragraphs, and a sign-off with [Your Name].",
    });
  }
  if (feature === "planner") {
    return block({
      role: "You are an expert productivity coach applying the Eisenhower matrix (urgency x importance) and deadline-driven scheduling.",
      context: `Planning horizon: ${clean(input["horizon"], 20)}\nWorking hours: ${clean(input["hours"], 60)}\nTasks (one per line, may include deadlines/notes):\n${clean(input["tasks"])}`,
      task: "Prioritise the tasks and produce a realistic schedule for the horizon.",
      constraints: [
        "Classify each task as Do First (urgent+important), Schedule (important), Delegate (urgent), or Eliminate/Later.",
        "Respect stated deadlines; earliest deadlines first within the same priority.",
        "Include short breaks; do not exceed the working hours.",
        "Do not add tasks the user did not list.",
      ],
      output: "Markdown with sections: '## Priorities' (bullet list: task — category — reason), '## Schedule' (time blocks or per-day list), '## Tips' (max 3 bullets).",
    });
  }
  return block({
    role: "You are a rigorous research analyst who explains complex material in plain language.",
    context: `Mode: ${clean(input["mode"], 40)}\nTopic or content provided:\n${clean(input["content"], 12000)}`,
    task: "Summarise the material, extract key insights, give practical recommendations, and simplify complex ideas.",
    constraints: [
      "Use plain language at roughly a grade 9 reading level.",
      "Clearly mark anything uncertain; do not fabricate statistics, quotes or sources.",
      "If only a topic is provided, rely on well-established general knowledge and say so.",
    ],
    output: "Markdown with sections: '## Summary' (3–5 sentences), '## Key Insights' (bullets), '## Recommendations' (numbered), '## In Simple Terms' (short analogy or explanation).",
  });
}
