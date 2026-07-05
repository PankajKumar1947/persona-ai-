import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { HITESH_PROMPT, PIYUSH_PROMPT } from "@/prompts";
import { getOpenAIClient } from "@/lib/ai";

interface ChatRequestBody {
  messages: OpenAI.Chat.ChatCompletionMessageParam[];
  persona: "hitesh" | "piyush";
}

export async function POST(req: NextRequest) {
  try {
    const { messages, persona }: ChatRequestBody = await req.json();

    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Mistral API Key is missing on the server. Please define MISTRAL_API_KEY in your .env file." },
        { status: 400 }
      );
    }

    const systemPrompt = persona === "hitesh" ? HITESH_PROMPT : PIYUSH_PROMPT;
    const openai = getOpenAIClient(apiKey);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const conversationHistory = [...messages];
          const pipelineSteps = ["INITIAL", "THINK", "ANALYSE", "OUTPUT"];

          for (const step of pipelineSteps) {
            // Send the start tag for the current pipeline step
            controller.enqueue(encoder.encode(`\n[${step}]\n`));

            const responseStream = await openai.chat.completions.create({
              model: "mistral-large-latest",
              messages: [
                { role: "system", content: systemPrompt },
                ...conversationHistory,
                { 
                  role: "user", 
                  content: `Generate only the content for the [${step}] stage of your thinking/response pipeline. Do not wrap it in tags or prefixes like "[${step}]", just output the raw content for this stage directly.` 
                }
              ],
              temperature: 0.7,
              stream: true,
            });

            let stepContent = "";
            for await (const chunk of responseStream) {
              const text = chunk.choices[0]?.delta?.content || "";
              if (text) {
                stepContent += text;
                controller.enqueue(encoder.encode(text));
              }
            }

            // Save the step output into the history context so the next step can use it
            conversationHistory.push({ 
              role: "assistant", 
              content: `[${step}]\n${stepContent}` 
            });
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An internal error occurred.";
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
