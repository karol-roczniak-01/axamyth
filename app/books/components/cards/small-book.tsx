"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface BookProps {
  title: string;
  onClick: () => void;
}

const SmallBook: React.FC<BookProps> = ({
  title,
  onClick
}) => {
  return ( 
    <Card
      className="hover:bg-accent/70 cursor-pointer transition py-2 px-4 rounded-md"
      onClick={onClick}
    >
      <CardTitle className="font-serif text-sm"> 
        {title}
      </CardTitle>
    </Card>
   );
}
 
export default SmallBook;