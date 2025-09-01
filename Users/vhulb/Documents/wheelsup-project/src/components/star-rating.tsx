
'use client';

import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

export function StarRating({ rating, totalStars = 5, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={cn(
              'h-5 w-5',
              starValue <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground/50'
            )}
          />
        );
      })}
    </div>
  );
}
