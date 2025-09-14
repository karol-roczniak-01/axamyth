import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import PageContent from "./page-content";
import { DialogsProvider } from "../components/dialogs/dialogs-provider";
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Ad({
  params
} : {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const preloadedAd = await preloadQuery(api.adFunctions.getAdById, {
    adId: id as Id<"ads">
  });

  const { user } = await withAuth();

  return (
    <>
      <DialogsProvider />
      <PageContent 
        id={id}
        preloadedAd={preloadedAd}
        userId={user?.id!}
        userEmail={user?.email!}
      />
    </>
  )
}