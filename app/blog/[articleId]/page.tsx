import { articles } from "@/lib/blog-articles";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ArticlePage({ params }: { params: { articleId: string } }) {
  const article = articles.find((a) => a.id === params.articleId);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">{article.title}</CardTitle>
            <CardDescription className="text-lg mt-2">{article.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none prose-lg">
            {article.content}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 