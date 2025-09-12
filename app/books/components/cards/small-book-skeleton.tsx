import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SmallBookSkeleton = () => {
  return ( 
    <Card className="hover:bg-accent/70 cursor-pointer transition py-2 px-2 rounded-md">
      <Skeleton className="w-1/3 h-4"/>
    </Card>
   );
}
 
export default SmallBookSkeleton;