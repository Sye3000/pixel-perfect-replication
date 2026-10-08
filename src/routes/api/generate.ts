import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildPrompt, type Feature } from "@/lib/prompts";

const FEATURES: Feature[] = ["email", "planner", "research"];

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
        let body: { feature?: Feature; input?: Record<string, unknown> };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        if (!body.feature || !FEATURES.includes(body.feature)) {
          return Response.json({ error: "Unknown feature." }, { status: 400 });
        }
        let runId: string | undefined;
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: async (input, init) => {
            const headers = new Headers(init?.headers);
            if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
            const res = await fetch(input, { ...init, headers });
            if (!res.ok) {
              const msg =
                res.status === 429
                  ? "Too many requests — please wait a moment and try again."
                  : res.status === 402
                    ? "AI credits are exhausted for this workspace."
                    : `AI request failed (${res.status}).`;
              throw new Error(msg);
            }
            runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
            return res;
          },
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system: "You are CampusOne's workplace productivity assistant. Follow the structured brief exactly.",
          prompt: buildPrompt(body.feature, body.input ?? {}),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const part of result.fullStream) {
                if (part.type === "text-delta") controller.enqueue(encoder.encode(part.text));
                if (part.type === "error") throw part.error;
              }
            } catch (e) {
              controller.enqueue(encoder.encode(`\n\n[[ERROR]]${e instanceof Error ? e.message : "Generation failed."}`));
            }
            controller.close();
          },
        });
        return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
