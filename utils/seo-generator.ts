export interface ReviewParams {
  dimensions: string[]
  tone: string
  tags?: string[]
}

export function generateReviewUrl(params: ReviewParams): string {
  const { dimensions, tone } = params
  const urlParts = [...dimensions.map((d) => d.toLowerCase().replace(/\s+/g, "-")), tone.toLowerCase()]
  return `/review/${urlParts.join("/")}`
}

export function generateSEOTitle(params: ReviewParams): string {
  const { dimensions, tone } = params
  const dimensionNames = dimensions.map((d) =>
    d
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  )
  return `Professor Review: ${dimensionNames.join(" + ")} | ${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone | AI Generator`
}

export function generateSEODescription(params: ReviewParams): string {
  const { dimensions, tone } = params
  return `AI-generated professor review focusing on ${dimensions.join(" and ")} with a ${tone} tone. Perfect for students reviewing professors on RateMyProfessor, Reddit, and academic forums.`
}

// 生成结构化数据
export function generateStructuredData(params: ReviewParams) {
  const { dimensions, tone } = params

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: generateSEOTitle(params),
    description: generateSEODescription(params),
    author: {
      "@type": "Organization",
      name: "RateMyProfessor.space",
    },
    publisher: {
      "@type": "Organization",
      name: "RateMyProfessor.space",
    },
    keywords: [
      "professor review",
      "rate my professor",
      ...dimensions.map((d) => d.toLowerCase()),
      tone,
      "AI generated",
      "college review",
    ].join(", "),
  }
}
