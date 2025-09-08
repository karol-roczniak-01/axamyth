"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { ArrowLeft, Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEditChapter } from "../hooks/use-edit-chapter";

interface PageContentProps {
  id: string;
  preloadedBook: Preloaded<typeof api.bookFunctions.getBookById>
};

const PageContent: React.FC<PageContentProps> = ({
  id,
  preloadedBook
}) => {
  const router = useRouter();
  const book = usePreloadedQuery(preloadedBook)
  const updateBookTitle = useMutation(api.bookFunctions.updateBookTitle);
  const createBookChapter = useMutation(api.bookChapterFunctions.createBookChapter);
  const bookChapters = useQuery(api.bookChapterFunctions.getChaptersByBookId, {
    bookId: id as Id<"books">
  });
  const editBookChapter = useEditChapter();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const handleSaveTitle = async (e: React.FormEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value.trim();
    if (newTitle && newTitle !== book?.title) {
      await updateBookTitle({
        bookId: id as Id<"books">,
        title: newTitle
      });
    }
    setIsEditingTitle(false);
  };

  const handleCreateChapter = async () => {
    setIsCreatingChapter(true);

    try {
      const newChapterId = await createBookChapter({
        bookId: id as Id<"books">,
        title: "New chapter title",
        content: "# Content goes here"
      });
    } catch (error) {
      console.error("Faild to create new chapter:", error);
    } finally {
      setIsCreatingChapter(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return ( 
    <div className="h-dvh w-full flex flex-col">
      {/* Header */}
      <header className="p-4 bg-background border-b sticky top-0 z-10">
        <Button
          variant="link"
          onClick={() => router.back()}
        >
          <ArrowLeft />
          Home
        </Button>
      </header>

      {/* Book */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl w-full flex flex-col gap-8 relative p-4 md:pt-32 pt-16">        
          {isEditingTitle ? (
            <input
              placeholder="Enter title here..."
              autoFocus
              defaultValue={book?.title}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              className="text-4xl font-semibold font-serif px-0 dark:bg-transparent rounded-none border-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
            />
          ) : (
            <h1
              className="text-4xl font-semibold font-serif cursor-pointer hover:text-muted-foreground transition"
              onClick={() => setIsEditingTitle(true)}
            >
              {book?.title}
            </h1>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {bookChapters?.map((chapter) => (
                <span 
                  className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                  key={chapter._id}
                  onClick={() => editBookChapter.openDialog(id, chapter._id)}
                >
                  {chapter.title}
                </span>
              ))}
            </div>
            <Button         
              className="w-fit text-muted-foreground rounded-full" 
              variant="secondary"
              onClick={handleCreateChapter}
            >
              {isCreatingChapter ? (
                <>
                  <Loader className="animate-spin"/>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus />
                  <span>Create chapter</span>
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
   );
}
 
export default PageContent;