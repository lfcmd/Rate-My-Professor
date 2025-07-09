export interface ProfessorRatings {
  [key: string]: number | null
}

export interface PromptBuilderParams {
  ratings: ProfessorRatings
  tags: string[]
  tone: string
}

export function buildProfessorReviewPrompt({ ratings, tags, tone }: PromptBuilderParams): string {
  const tonePromptMap = {
    neutral: "You are helping a student write a neutral and objective review.",
    funny: "You are helping a student write a humorous review.",
    sarcastic: "You are helping a student write a sarcastic and witty review.",
    debate: "You are helping a student write a fair, balanced analysis-style review.",
    wholesome: "You are helping a student write a kind and wholesome review.",
    heartbroken: "You are helping a student write a dramatic, over-the-top review.",
    intellectual: "You are helping a student write a philosophical and reflective review.",
    meme: "You are helping a student write a meme-style professor review using internet slang.",
    chill: "You are helping a student write a casual, friendly review.",
    "brutally-honest": "You are helping a student write a brutally honest review.",
  }

  const filteredRatings = Object.entries(ratings)
    .filter(([, score]) => score !== null && score !== undefined)
    .map(([category, score]) => `- ${category}: ${score}/5`)
    .join("\n")

  const tagDescription = tags.length > 0 ? `The professor is described as: ${tags.join(", ")}.` : ""

  return `${tonePromptMap[tone as keyof typeof tonePromptMap] || tonePromptMap.neutral}

Student has rated the professor in the following aspects:
${filteredRatings}

${tagDescription}

Based on this, write a short review in 3–5 sentences. Use the selected tone. Do not mention the numerical scores explicitly.`.trim()
}
