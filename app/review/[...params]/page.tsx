"use client";

import { type Metadata } from "next";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { type ParsedUrlQuery } from "querystring";
import { RatingStars } from "@/components/rating-stars";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewPageParams extends ParsedUrlQuery {
  schoolName: string;
  professorName: string;
  courseName: string;
  rating: string;
  difficulty: string;
  review: string;
}

const ReviewPage = ({ params }: { params: { params:string[] } }) => {
  const decodedParams = params.params.map((p) => decodeURIComponent(p));
  const [
    schoolName,
    professorName,
    courseName,
    rating,
    difficulty,
    review,
  ] = decodedParams;

  const parsedRating = Number.parseInt(rating, 10);
  const parsedDifficulty = Number.parseInt(difficulty, 10);

  return (
    <div className="mx-auto my-12 max-w-4xl px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{professorName}</CardTitle>
          <CardDescription className="text-lg">
            {schoolName} - {courseName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed">{review || "N/A"}</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Overall Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingStars rating={parsedRating} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{parsedDifficulty}/10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <button className="flex items-center space-x-2 text-green-500">
            <ThumbsUp /> <span>Helpful</span>
          </button>
          <button className="flex items-center space-x-2 text-red-500">
            <ThumbsDown /> <span>Not Helpful</span>
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReviewPage;
