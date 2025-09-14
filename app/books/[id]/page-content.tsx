"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { ArrowLeft, Dot, Loader, Pen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEditChapter } from "../hooks/use-edit-chapter";
import { useReadBook } from "../hooks/use-read-book";
import { formatCreationTime } from "@/lib/utils";
import { useEditBook } from "../hooks/use-edit-book";

interface PageContentProps {
  id: string;
  preloadedBook: Preloaded<typeof api.bookFunctions.getBookById>
  isOwner: boolean;
};

const PageContent: React.FC<PageContentProps> = ({
  id,
  preloadedBook,
  isOwner
}) => {
  const router = useRouter();
  const book = usePreloadedQuery(preloadedBook)
  const createBookChapter = useMutation(api.bookChapterFunctions.createBookChapter);
  const bookChapters = useQuery(api.bookChapterFunctions.getChaptersByBookId, {
    bookId: id as Id<"books">
  });
  const editBook = useEditBook();
  const editBookChapter = useEditChapter();
  const readBook = useReadBook();

  const [isCreatingChapter, setIsCreatingChapter] = useState(false);

  const handleCreateChapter = async () => {
    setIsCreatingChapter(true);

    try {
      await createBookChapter({
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

      {/* Book */}
      <div className="w-full flex justify-center">
        <div className="max-w-2xl w-full flex flex-col gap-8 relative p-4 md:mt-32 sm:mt-16 mt-8">        
          <div className="flex gap-4 justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="flex gap-2 text-sm text-muted-foreground">
                Book
              </span>
              <Dot 
                size={12}
                className="text-muted-foreground"
              />
              {book?._creationTime && (
                <span className="text-sm text-muted-foreground">
                  {formatCreationTime(book._creationTime)}
                </span>
              )}
            </div>
            <Button 
              className="w-9"
              variant="ghost"
              onClick={() => editBook.openDialog(
                book?._id || '', 
                book?.title || ''
              )}
            >
              <Pen />
            </Button>
          </div>
          <h1
            className="text-4xl font-semibold font-serif"
          >
            {book?.title}
          </h1>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {bookChapters?.map((chapter) => (
                <div 
                  key={chapter._id}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="text-muted-foreground hover:text-foreground transition cursor-pointer"
                    onClick={() => readBook.openDialog(id, chapter._id, bookChapters)}
                  >
                    {chapter.title}
                  </span>
                  <Button
                    variant="ghost"
                    className="w-6 h-6 text-muted-foreground dark:hover:bg-transparent hover:bg-transparent rounded-[8px]"
                    onClick={() => editBookChapter.openDialog(id, chapter._id)}
                 >
                    <Pen />
                  </Button>
                </div>
              ))}
            </div>
            <Button         
              className="w-fit text-muted-foreground" 
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