"use client"

import { articles } from "@/lib/blog-articles"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center tracking-tight lg:text-5xl">Our Blog</h1>
      <p className="mb-12 text-center text-lg text-muted-foreground">
        Tips and guides to help you succeed in your academic journey.
      </p>
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {articles.map((article) => (
            <AccordionItem value={article.id} key={article.id}>
              <AccordionTrigger className="text-left">
                <div>
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{article.subtitle}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="prose max-w-none pt-6">
                    {article.content}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
} 