"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Copy, Sparkles, RefreshCw, Plus, X, BarChart3, Users, Zap, Shield, MessageSquare, Menu, ChevronRight, CheckCircle, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RatingStars } from "@/components/rating-stars"
import { buildProfessorReviewPrompt, type ProfessorRatings } from "@/utils/prompt-builder"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

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

const FEATURES = [
  {
    title: "AI-Powered Generation",
    description: "Utilize advanced AI to generate articulate and coherent professor reviews in seconds.",
    icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
  },
  {
    title: "Multiple Rating Dimensions",
    description: "Rate professors on various aspects like clarity, fairness, and engagement for a comprehensive review.",
    icon: <BarChart3 className="w-6 h-6 text-indigo-500" />,
  },
  {
    title: "Customizable Tone & Style",
    description: "Choose from over 10 writing styles, from 'funny' to 'brutally honest', to match your true feelings.",
    icon: <Users className="w-6 h-6 text-indigo-500" />,
  },
  {
    title: "Keyword Integration",
    description: "Add specific keywords and tags to highlight key traits and experiences with the professor.",
    icon: <Plus className="w-6 h-6 text-indigo-500" />,
  },
  {
    title: "Secure & Private",
    description: "Your ratings and generated reviews are not stored. Your privacy is our top priority.",
    icon: <Shield className="w-6 h-6 text-indigo-500" />,
  },
]

const HOW_TO_USE_STEPS = [
  {
    title: "1. Rate Your Professor",
    description: "Select at least 2 dimensions and give a rating from 1 to 5 stars. The more you rate, the better the review.",
  },
  {
    title: "2. Add Keywords",
    description: "Choose from predefined keywords or add your own to highlight specific aspects of your experience.",
  },
  {
    title: "3. Select a Writing Style",
    description: "Pick a tone that best reflects your opinion, from neutral and professional to sarcastic or funny.",
  },
  {
    title: "4. Generate & Copy",
    description: "Click the generate button, and our AI will craft a review for you. Copy it with a single click!",
  },
]

const FAQS = [
  {
    question: "Is this service free to use?",
    answer:
      "Yes, our basic review generation is completely free. We may introduce premium features in the future to support the service.",
  },
  {
    question: "What AI model powers the generator?",
    answer: "We use state-of-the-art large language models provided by DeepSeek-R1 to ensure high-quality and fast generation.",
  },
  {
    question: "Is my data and privacy protected?",
    answer:
      "Absolutely. We do not store any of your ratings, keywords, or the generated reviews. The entire process is anonymous and stateless.",
  },
  {
    question: "Where can I use the generated reviews?",
    answer:
      "You can use them on platforms like Rate My Professors, university forums, course feedback forms, or anywhere you share student feedback.",
  },
  {
    question: "Can I customize the review after it's generated?",
    answer:
      "Of course! The generated text is a starting point. You can copy it and edit it to perfection before posting.",
  },
  {
    question: "Why does it ask for at least 2 rating dimensions?",
    answer:
      "Providing at least two data points helps the AI understand the context better and generate a more meaningful and balanced review.",
  },
]

export default function ProfessorReviewGenerator() {
  const [ratings, setRatings] = useState<ProfessorRatings>({})
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [customKeyword, setCustomKeyword] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [generatedReview, setGeneratedReview] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  // The main component render method
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-28 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              AI <span className="text-primary">Rate My Professor</span> for College Students
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed mb-10">
              Create authentic, engaging professor reviews instantly using advanced AI technology. Perfect for RateMyProfessor, Reddit, academic forums, and student communities. No registration required.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="#generator"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Start Generating for Free
                <ChevronRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* What can you do with this Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Maximize Your Review Impact
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your professor review into a powerful tool that benefits the entire student community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
              {/* Card 1 - Rate My Professors */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Rate My Professors
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Share authentic reviews on the most trusted professor rating platform, helping thousands of students make informed course decisions.
                  </p>
                </div>
              </div>

              {/* Card 2 - Social Media */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Social Networks
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Amplify your voice across university forums, Facebook groups, and Reddit communities to reach a broader student audience.
                  </p>
                </div>
              </div>

              {/* Card 3 - Official Feedback */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-t-2xl"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Course Evaluations
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Use as structured foundation for official course evaluations and end-of-semester feedback forms with clear, organized thoughts.
                  </p>
                </div>
              </div>

              {/* Card 4 - Student Community */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-2xl"></div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Student Community
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Build a supportive academic environment by contributing valuable insights that help peers make better educational choices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                Get Your Review in 4 Simple Steps
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Our intuitive interface makes generating reviews a breeze.
              </p>
            </div>
            
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center px-4">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">01</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">1. Rate Your Professor</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Select at least 2 dimensions and give a rating from 1 to 5 stars. The more you rate, the better the review.
                </p>
              </div>
              
              <div className="text-center px-4">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">02</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">2. Add Keywords</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Choose from predefined keywords or add your own to highlight specific aspects of your experience.
                </p>
              </div>
              
              <div className="text-center px-4">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">03</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">3. Select a Writing Style</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Pick a tone that best reflects your opinion, from neutral and professional to sarcastic or funny.
                </p>
              </div>
              
              <div className="text-center px-4">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg sm:text-xl">04</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">4. Generate & Copy</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Click the generate button, and our AI will craft a review for you. Copy it with a single click!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Generator Section */}
        <section id="generator" className="pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:gap-16">
              <div className="space-y-12">
                {/* Step 1: Ratings */}
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

                {/* Step 2: Keywords */}
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

                {/* Step 3: Writing Style */}
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

                {/* Generate Button */}
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

                {/* Step 4: Generated Review */}
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


        {/* Features Section */}
        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                Everything You Need to Write Better Reviews
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Our tool is packed with features designed to make professor reviews effortless and expressive.
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="p-6 sm:p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-indigo-100 text-white mb-4 sm:mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                Save Time, Reduce Stress, and Be Heard
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Writing reviews shouldn't be a chore. Our generator empowers you to provide valuable feedback without the hassle.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-200 p-6 sm:p-8 lg:p-12">
              <div className="space-y-8 sm:space-y-10">
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Overcome Writer's Block</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      No more staring at a blank page. Get a well-structured draft in seconds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Express Yourself Perfectly</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      With multiple tones and styles, your review will finally match your true feelings.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 sm:space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Provide Better Feedback</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Help other students make informed decisions with clear, comprehensive, and helpful reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
            </div>
            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-lg font-medium text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-base text-gray-500">&copy; {currentYear} RateMyProfessor.space. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  )
}
