"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Dot, Globe, Lock } from "lucide-react";

interface AdProps {
  title: string;
  type: string;
  isPublic: boolean;
  onClick: () => void;
}

const Ad: React.FC<AdProps> = ({
  title,
  type,
  isPublic,
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
      <CardFooter className="gap-1 text-muted-foreground">
        {isPublic ? (
          <div className="flex gap-2 items-center text-sm">
            <Globe size={16} />
            Live
          </div>
        ) : (
          <div className="flex gap-2 items-center text-sm">
            <Lock size={16} />
            Private
          </div>
        )}
        <Dot size={12}/>
        {type === 'book' ? (
          <div className="flex gap-2 items-center text-sm">
            <Book size={16} />
            Books
          </div>
        ) : type === 'paper' ? (
          <div className="flex gap-2 items-center text-sm">
            {/* papers content */}
          </div>
        ) : null}
      </CardFooter>
    </Card>
   );
}
 
export default Ad;