"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const BookSkeleton = () => {
  return ( 
    <Card className="gap-2">
      <CardHeader>
        <Skeleton className="w-full h-6"/>
      </CardHeader>
      <CardFooter>
        <Skeleton className="w-1/2 h-4"/>
      </CardFooter>
    </Card>   
   );
}
 
export default BookSkeleton;