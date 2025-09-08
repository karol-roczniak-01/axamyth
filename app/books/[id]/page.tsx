import { preloadQuery } from "convex/nextjs";
import PageContent from "./page-content";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { BookDialogsProvider } from "../components/book-dialogs-provider";

export default async function Book({
  params
} : {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const preloadedBook = await preloadQuery(api.bookFunctions.getBookById, {
    bookId: id as Id<"books">
  });

  return (
    <>
      <BookDialogsProvider />
      <PageContent 
        id={id} 
        preloadedBook={preloadedBook}
      />
    </>
  )
}