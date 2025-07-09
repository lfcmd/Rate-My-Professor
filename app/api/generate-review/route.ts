import { type NextRequest, NextResponse } from "next/server";

function buildPrompt(style: string, context: string): string {
  const template = `As a university student, write a review for a professor.
Style: ${style}
Review Context: ${context}
Please write only the review content, without any other text.`;
  return template.trim();
}

async function callGenerativeAPI(
  messages: { role: string; content: string }[],
  max_tokens: number,
  temperature: number,
) {
  const apiKey = process.env.SILICONFLOW_API_KEY!;
  const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
      messages,
      temperature,
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function POST(request: NextRequest) {
  try {
    const { style, prompt } = await request.json();

    if (!style || !prompt) {
      return NextResponse.json({ error: "Missing style or prompt" }, { status: 400 });
    }

    const fullPrompt = buildPrompt(style, prompt);
    const messages = [{ role: "user", content: fullPrompt }];
    const review = await callGenerativeAPI(messages, 120, 0.7);

    return NextResponse.json({ review });
  } catch (err) {
    console.error("Generation error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ error: "Failed to generate review", details: errorMessage }, { status: 500 });
  }
} 