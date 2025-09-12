import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import PageContent from "./page-content";
import { DialogsProvider } from "../components/dialogs/dialogs-provider";

export default async function Ad({
  params
} : {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const preloadedAd = await preloadQuery(api.adFunctions.getAdById, {
    adId: id as Id<"ads">
  });

  // Use real WorkOS user id and conver userId
  const isOwner = true

  return (
    <>
      <DialogsProvider />
      <PageContent 
        id={id}
        preloadedAd={preloadedAd}
        isOwner={isOwner}
      />
    </>
  )
}