 "use client"

import { articles } from "@/lib/blog-articles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
                <Link
                  href={`/blog/${article.id}`}
                  className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
                >
                  Read Full Article
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}