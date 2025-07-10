"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Copy, Sparkles, RefreshCw, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RatingStars } from "@/components/rating-stars"
import { buildProfessorReviewPrompt, type ProfessorRatings } from "@/utils/prompt-builder"

const RATING_DIMENSIONS = [
  {
    key: "Clarity of Instruction",
    label: "Clarity of Instruction",
    description: "授课清晰度 - 教授表达是否清楚、逻辑是否顺畅",
  },
  {
    key: "Helpfulness",
    label: "Helpfulness",
    description: "是否乐于助人 - 是否愿意课后答疑、回复邮件",
  },
  {
    key: "Grading Fairness",
    label: "Grading Fairness",
    description: "评分是否公平 - 是否公开评分标准、公平打分",
  },
  {
    key: "Homework Load",
    label: "Homework Load",
    description: "作业负担 - 作业是否太多、频率如何",
  },
  {
    key: "Course Difficulty",
    label: "Course Difficulty",
    description: "课程难度 - 内容难度/通过难度是否合理",
  },
  {
    key: "Lecture Engagement",
    label: "Lecture Engagement",
    description: "上课是否有趣 - 是否互动多、课堂是否沉闷",
  },
  {
    key: "Pacing of the Course",
    label: "Pacing of the Course",
    description: "授课节奏 - 是否讲太快或太慢",
  },
  {
    key: "Use of Examples",
    label: "Use of Examples",
    description: "举例清晰度 - 是否善于用例子说明抽象概念",
  },
  {
    key: "Responsiveness",
    label: "Responsiveness",
    description: "回复速度 - 回复邮件、留言、线上问答等是否及时",
  },
  {
    key: "Attendance Policy Strictness",
    label: "Attendance Policy Strictness",
    description: "考勤制度严不严 - 点名频率、请假是否宽容",
  },
]

const PREDEFINED_KEYWORDS = [
  "Clear lectures",
  "Too much homework",
  "Harsh grading",
  "Funny",
  "Monotone",
  "Very helpful",
  "Group projects",
  "Attendance matters",
  "Easy A",
  "Boring",
  "Inspiring",
  "Disorganized",
  "Fair grader",
  "Tough but fair",
  "Passionate",
  "Unapproachable",
  "Knowledgeable",
  "Responsive",
  "Late assignments",
  "Pop quizzes",
]

const STYLES = [
  { id: "neutral", name: "🎓 Neutral", description: "中立学术风格 - 客观平衡的学术评价" },
  { id: "funny", name: "😄 Funny", description: "幽默风格 - 轻松有趣的表达方式" },
  { id: "brutally-honest", name: "😬 Brutally Honest", description: "毫不留情 - 直接坦率不加修饰" },
  { id: "chill", name: "😎 Chill", description: "随意聊天风 - 朋友间的轻松对话" },
  { id: "heartbroken", name: "💔 Heartbroken", description: "戏剧化痛苦风 - 夸张的情感表达" },
  { id: "sarcastic", name: "🐸 Sarcastic", description: "讽刺风 - 巧妙的反讽和暗示" },
  { id: "intellectual", name: "🧠 Intellectual", description: "假装哲学家 - 深刻的哲学思考" },
  { id: "meme", name: "👽 Meme-style", description: "模因梗风格 - 网络流行语表达" },
  { id: "wholesome", name: "🦄 Wholesome", description: "暖心风格 - 温暖感人的表达" },
  { id: "debate", name: "🗣️ Debate-style", description: "正反分析 - 平衡的优缺点分析" },
]

export default function ProfessorReviewGenerator() {
  const [ratings, setRatings] = useState<ProfessorRatings>({})
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [customKeyword, setCustomKeyword] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [generatedReview, setGeneratedReview] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const handleRatingChange = (dimension: string, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [dimension]: rating,
    }))
  }

  const getRatedDimensionsCount = () => {
    return Object.values(ratings).filter((rating) => rating !== null && rating !== undefined).length
  }

  const toggleKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword))
    } else if (selectedKeywords.length < 8) {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
  }

  const handleAddCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim()) && selectedKeywords.length < 8) {
      setSelectedKeywords([...selectedKeywords, customKeyword.trim()])
      setCustomKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword))
  }

  const generateReview = async () => {
    const ratedDimensions = getRatedDimensionsCount()

    if (ratedDimensions < 2 || !selectedStyle) {
      toast({
        title: "Missing Requirements",
        description: "Please rate at least 2 dimensions and select a writing style.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const prompt = buildProfessorReviewPrompt({
        ratings,
        tags: selectedKeywords,
        tone: selectedStyle,
      })

      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate review")
      }

      const data = await response.json()
      setGeneratedReview(data.review)
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview)
      toast({
        title: "Copied Successfully!",
        description: "Review copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="flex-1">
        <section id="generator" className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
                Professor Review Generator
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Craft the perfect professor review with the help of AI.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
              <div className="space-y-12">
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                        1
                      </div>
                      <h2 className="text-xl sm:text-2xl">Rate the Professor</h2>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">Rate at least 2 dimensions to get started.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                      {RATING_DIMENSIONS.map((dim) => (
                        <div key={dim.key} className="space-y-2">
                          <label className="text-sm sm:text-base font-medium text-gray-700 block">{dim.label}</label>
                          <RatingStars
                            rating={ratings[dim.key] ?? 0}
                            onRatingChange={(rating: number) => handleRatingChange(dim.key, rating)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                        2
                      </div>
                      <h2 className="text-xl sm:text-2xl">Add Keywords (Optional)</h2>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">Select up to 8 keywords that describe the professor.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4 sm:space-y-6">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {PREDEFINED_KEYWORDS.map((keyword) => (
                        <Badge
                          key={keyword}
                          variant={selectedKeywords.includes(keyword) ? "default" : "secondary"}
                          onClick={() => toggleKeyword(keyword)}
                          className="cursor-pointer text-xs sm:text-sm py-1 px-2 sm:px-3"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Input
                        value={customKeyword}
                        onChange={(e) => setCustomKeyword(e.target.value)}
                        placeholder="Add a custom keyword..."
                        onKeyDown={(e) => e.key === "Enter" && handleAddCustomKeyword()}
                        className="flex-1"
                      />
                      <Button onClick={handleAddCustomKeyword} className="sm:w-auto">
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {selectedKeywords.map((keyword) => (
                        <Badge key={keyword} variant="default" className="flex items-center">
                          {keyword}
                          <button onClick={() => removeKeyword(keyword)} className="ml-2">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                        3
                      </div>
                      <h2 className="text-xl sm:text-2xl">Choose a Writing Style</h2>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">Select the tone for your review.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`p-3 sm:p-4 rounded-lg text-center border-2 transition-all duration-200 ${
                            selectedStyle === style.id ? "border-blue-500 bg-blue-50 shadow-md" : "border-transparent bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          <div className="text-base sm:text-lg font-medium">{style.name.split(" ")[0]}</div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">{style.name.split(" ").slice(1).join(" ")}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button 
                    onClick={generateReview} 
                    disabled={isGenerating} 
                    size="lg" 
                    className="w-full sm:w-auto min-w-[200px] px-8 py-3 text-base sm:text-lg font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Review
                      </>
                    )}
                  </Button>
                </div>

                {generatedReview && (
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm sm:text-base font-bold">4</span>
                        </div>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Generated Review</h2>
                      <p className="text-blue-100 text-sm sm:text-base">Your AI-generated professor review</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                      <div className="bg-white rounded-lg p-4 sm:p-6">
                        <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                          {generatedReview}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button 
                        onClick={copyToClipboard} 
                        className="flex-1 bg-white text-blue-600 hover:bg-blue-50 py-3 sm:py-4 font-semibold"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Review
                      </Button>
                      <Button 
                        onClick={generateReview} 
                        variant="outline" 
                        className="sm:w-auto px-6 py-3 sm:py-4 border-white/30 text-white hover:bg-white/10"
                      >
                        <RefreshCw className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Regenerate</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-base text-gray-500">&copy; {currentYear} RateMyProfessor.space. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
} 