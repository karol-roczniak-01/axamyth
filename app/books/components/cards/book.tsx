"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCreationTime } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface BookProps {
  title: string;
  creationTime: number;
  onClick: () => void;
}

const Book: React.FC<BookProps> = ({
  title,
  creationTime,
  onClick
}) => {
  return ( 
    <Card 
      className="hover:bg-accent/70 cursor-pointer transition gap-4"
      onClick={onClick}
    >
      <CardHeader className="h-full">
        <CardTitle className="font-serif">
          {title}
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2 text-muted-foreground">
        <div className="flex gap-2 items-center text-sm">
          <CalendarDays size={16}/>
          {formatCreationTime(creationTime)}
        </div>
      </CardFooter>      
    </Card>
   );
}
 
export default Book;