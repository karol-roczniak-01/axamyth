import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

export const formatCreationTime = (timestamp: number) => {
  const date = new Date(timestamp);
  
  // Option 1: Simple date format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Option 2: Date with time
  // return date.toLocaleString();
  
  // Option 3: Relative time (like "2 days ago")
  // const now = new Date();
  // const diffInMs = now.getTime() - timestamp;
  // const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  // 
  // if (diffInDays === 0) return "Today";
  // if (diffInDays === 1) return "Yesterday";
  // if (diffInDays < 7) return `${diffInDays} days ago`;
  // return date.toLocaleDateString();
};
