"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserAds from "./components/grids/user-ads";

interface PageContentProps {
  userId: string;
};

const PageContent: React.FC<PageContentProps> = ({
  userId
}) => {
  const router = useRouter();
  
  // Ad creation
  const [isCreating, setIsCreating] = useState(false);
  const createAd = useMutation(api.adFunctions.createAd);

  // Handle create new ad
  const handleCreateNewAd = async () => {
    setIsCreating(true);

    try {
      const newAdId = await createAd({
        userId: userId,
        type: "book",
        layout: "single-item",
        title: "This is ad title",
        description: "This is ad description",
        buttonText: "Learn more",
        buttonUrl: "https://youtube.com",
        public: false
      });
      router.push(`/ads/${newAdId}`)
    } catch (error) {
      console.error("Failed to create new ad:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return ( 
    <div className="h-dvh w-full flex flex-col">
      {/* Header */}
      <header className="p-4 border-b sticky top-0 z-10">
        <Button
          variant="link"
          onClick={() => router.push('/')}
        >
          <ArrowLeft />
          Home
        </Button>
      </header>

      {/* Button */}
      <div className="w-full flex justify-center border-b sticky z-10">
        <div className="max-w-2xl w-full flex justify-end gap-2 relative p-4">
          <Button
            className="h-11 rounded-full [&_svg:not([class*='size-'])]:size-5"
            size="lg"
            onClick={handleCreateNewAd}
          >
            <Plus />
            Add
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl p-4 mx-auto">
          <UserAds userId={userId} />
        </div>
      </div>
    </div>
   );
}
 
export default PageContent;