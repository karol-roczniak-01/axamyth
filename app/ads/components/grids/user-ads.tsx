"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Ad from "../cards/ad";

interface UserAdsProps {
  userId: string;
};

const UserAds: React.FC<UserAdsProps> = ({
  userId
}) => {
  const router = useRouter();

  const numberOfAds = 6;

  const userAds = useQuery(api.adFunctions.getUserAds, {
    userId: userId
  });

  return ( 
    <div className="grid grid-cols-2 gap-4">
      {userAds?.map((ad) => (
        <Ad 
          key={ad._id}
          title={ad.title}
          type={ad.type}
          isPublic={ad.public}
          onClick={() => router.push(`/ads/${ad._id}`)}
        />
      ))}
    </div>
   );
}
 
export default UserAds;