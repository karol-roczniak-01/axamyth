import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useReadBook } from "../../hooks/use-read-book";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { components } from "../mdx-components";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ReadBook = () => {
  const { 
    isOpen, 
    chapterId, 
    chapters, 
    closeDialog
  } = useReadBook();
  
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set initial chapter when dialog opens
  useEffect(() => {
    if (isOpen && chapterId) {
      setCurrentChapterId(chapterId);
    }
  }, [isOpen, chapterId]);

  const bookChapter = useQuery(
    api.bookChapterFunctions.getBookChapterById,
    currentChapterId ? { chapterId: currentChapterId as Id<"bookChapters"> } : "skip"
  );

  // Find current chapter index and calculate navigation
  const currentChapterIndex = chapters?.findIndex(chapter => chapter._id === currentChapterId) ?? -1;
  const hasPrevious = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < (chapters?.length ?? 0) - 1;
  const previousChapterId = hasPrevious ? chapters?.[currentChapterIndex - 1]._id : null;
  const nextChapterId = hasNext ? chapters?.[currentChapterIndex + 1]._id : null;

  const rawContent = bookChapter?.content;

  // Process the raw content when it changes
  useEffect(() => {
    const processContent = async () => {
      if (rawContent && typeof rawContent === 'string') {
        setIsProcessing(true);
        try {
          const serialized = await serialize(rawContent);
          setMdxSource(serialized);
        } catch (error) {
          console.error('Error processing MDX content:', error);
          setMdxSource(null);
        } finally {
          setIsProcessing(false);
        }
      } else {
        setMdxSource(null);
      }
    };

    processContent();
  }, [rawContent]);

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
      setCurrentChapterId(null);
    }
  };

  const handlePrevious = () => {
    if (previousChapterId) {
      setCurrentChapterId(previousChapterId);
    }
  };

  const handleNext = () => {
    if (nextChapterId) {
      setCurrentChapterId(nextChapterId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="h-dvh gap-0 min-w-full rounded-none border-none p-0 flex flex-col items-center">
        <DialogHeader className="p-4 relative w-full">
          <Button 
            variant="link" 
            className="absolute top-4 left-4"
            onClick={closeDialog}
          >
            <X />
            Close
          </Button>
          <DialogTitle className="text-muted-foreground font-serif text-center">
            <Button
              className="pointer-events-none text-lg"
              variant="ghost"
            >
              {bookChapter?.title}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 border-y overflow-auto w-full flex justify-center">
          <div className="w-full max-w-2xl p-4">
            {mdxSource && (
              <div className="prose prose-sm max-w-none py-8">
                <MDXRemote {...mdxSource} components={components} />
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="p-4 w-full max-w-2xl">
          <div className="w-full grid grid-cols-2 gap-2">
            <Button 
              variant="secondary"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className=""
            >
              <ChevronLeft />
              <span>Previous Chapter</span>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hasNext}
              className=""
            >
              <span>Next Chapter</span>
              <ChevronRight />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadBook;