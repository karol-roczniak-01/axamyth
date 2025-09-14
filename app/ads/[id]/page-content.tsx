"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditAd } from "../hooks/use-edit-ad";
import Image from "next/image";
import { useEditTarget } from "../hooks/use-edit-target";

interface PageContentProps {
  id: string;
  preloadedAd: Preloaded<typeof api.adFunctions.getAdById>;
  userId: string;
  userEmail: string;
};

const PageContent: React.FC<PageContentProps> = ({
  id,
  preloadedAd,
  userId,
  userEmail
}) => {
  const router = useRouter();
  const ad = usePreloadedQuery(preloadedAd)
  const editAd = useEditAd();
  const editTarget = useEditTarget();

  return ( 
    <div className="h-dvh w-full flex flex-col">
      {/* Header */}
      <header className="p-4 bg-background border-b sticky top-0 z-10">
        <Button
          variant="link"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Back
        </Button>
      </header>

      {/* */}
      <div className="w-full flex justify-center">
        <div className="max-w-3xl w-full flex flex-col gap-8 relative p-4 md:mt-32 sm:mt-16 mt-8">
          {/* Who can view */}
          <div className="grid grid-cols-12 items-center">
            <div className="items-center flex gap-2 col-span-4">
              <p className="text-base font-serif text-muted-foreground">
                Who Can View
              </p>
              <Button
                className="w-8 h-8"
                variant="ghost"
                onClick={() => editTarget.openDialog(userId, userEmail, id)}
              >
                <Pen />
              </Button>
            </div>
            <div className="col-span-8">
              <div className="grid grid-cols-12">
                <div className="col-span-3 pr-4">
                  Book Readers
                </div>
                <div className="border-l flex flex-col gap-4 pl-4 col-span-9">
                  Books list
                </div>                
              </div>
            </div>
          </div>
          {/* Separator */}
          <div className="h-[1px] w-full bg-border"/>

          {/* How it appears */}
          <div className="grid grid-cols-12 items-center">
            <div className="items-center flex gap-2 col-span-4">
              <p className="text-base font-serif text-muted-foreground">
                How It Appears
              </p>
              <Button
                className="w-8 h-8"
                variant="ghost"
                onClick={() => editAd.openDialog(
                  ad?._id || '', 
                  ad?.layout || '',
                  ad?.title || '',
                  ad?.description || '',
                  ad?.price || 0,
                  ad?.buttonText || '',
                  ad?.buttonUrl || '',
                  ad?.imagePath || '',
                  ad?.imageUrl || ''
                )}
              >
                <Pen />
              </Button>
            </div>
            <Card className="col-span-8">
              <CardContent>
                <div className="flex gap-6">
                  {ad?.imageUrl ? (
                    <div className="w-22 h-22 shrink-0 rounded-lg bg-accent">
                      <Image 
                        src={ad.imageUrl}
                        alt="Ad image"
                        width={128}
                        height={128}
                        className="object-cover aspect-square rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-22 h-22 shrink-0 rounded-lg bg-accent">
                    
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    <h1 className="text-2xl font-serif">
                      {ad?.title}
                    </h1>
                    <p className="font-semibold">
                      ${ad?.price}
                    </p>
                    <p className="text-muted-foreground">
                      {ad?.description}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost">
                  Close
                </Button>
                <Button>
                  Try now!
                </Button>
              </CardFooter>
            </Card>
          </div>
          {/* Separator */}
          <div className="h-[1px] w-full bg-border"/>

          {/* Impression stats */}
          <div className="grid grid-cols-12 items-center">
            <div className="items-center flex gap-2 col-span-4">
              <p className="text-base font-serif text-muted-foreground">
                Impression Stats
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
   );
}
 
export default PageContent;