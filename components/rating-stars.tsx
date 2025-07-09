"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  starSize?: number;
  disabled?: boolean;
}

export function RatingStars({
  rating,
  onRatingChange,
  starSize = 24,
  disabled = false,
}: RatingStarsProps) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && onRatingChange?.(star)}
          className={cn(
            "p-1 rounded transition-colors",
            {
              "cursor-pointer hover:bg-gray-100": !disabled,
              "cursor-not-allowed opacity-50": disabled,
            }
          )}
        >
          <Star
            size={starSize}
            className={cn(
              "text-gray-300 transition-colors",
              { "hover:text-yellow-400": !disabled },
              { "text-yellow-400 fill-yellow-400": rating >= star },
            )}
          />
        </button>
      ))}
    </div>
  );
}
