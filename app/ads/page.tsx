import { withAuth } from "@workos-inc/authkit-nextjs";
import PageContent from "./page-content";

export default async function Ads() {
  const { user } = await withAuth();

  return (
    <PageContent 
      userId={user?.id!}
    />
  )
}