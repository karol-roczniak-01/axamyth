import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditChapter } from "../../hooks/use-edit-chapter";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { githubDarkInit } from '@uiw/codemirror-theme-github';
import { Loader } from "lucide-react";
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { components } from "../mdx-components";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const EditBookChapter = () => {
  const { isOpen, bookId, chapterId, closeDialog } = useEditChapter();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isProcessingMdx, setIsProcessingMdx] = useState(false);
     
  const bookChapter = useQuery(
    api.bookChapterFunctions.getBookChapterById, 
    chapterId ? { chapterId: chapterId as Id<"bookChapters"> } : "skip"
  );
  const updateChapter = useMutation(api.bookChapterFunctions.updateBookChapterContent);
  const deleteChapter = useMutation(api.bookChapterFunctions.deleteBookChapter)

  // Debounce the content for saving
  const [debouncedContent] = useDebounce(content, 1000);
  
  // Debounce the content for MDX processing (longer delay to avoid too many updates)
  const [debouncedContentForMdx] = useDebounce(content, 1000);

  // Initialize content when chapter data loads (only once per chapter)
  useEffect(() => {
    if (bookChapter?.content !== undefined && chapterId && !isInitialized) {
      setContent(bookChapter.content);
      setLastSavedContent(bookChapter.content);
      setIsInitialized(true);
    }
  }, [bookChapter?.content, chapterId, isInitialized]);

  // Reset initialization when chapter changes
  useEffect(() => {
    setIsInitialized(false);
    setContent(""); // Clear old content immediately
    setLastSavedContent("");
    setMdxSource(null);
  }, [chapterId]);

  // Process MDX when debounced content changes
  useEffect(() => {
    const processMdx = async () => {
      if (debouncedContentForMdx && isInitialized) {
        setIsProcessingMdx(true);
        try {
          const mdxSource = await serialize(debouncedContentForMdx, {
            mdxOptions: {
              remarkPlugins: [],
              rehypePlugins: [],
            },
          });
          setMdxSource(mdxSource);
        } catch (error) {
          console.error("Failed to process MDX:", error);
          // On error, you might want to show the raw content or an error message
          setMdxSource(null);
        } finally {
          setIsProcessingMdx(false);
        }
      }
    };

    processMdx();
  }, [debouncedContentForMdx, isInitialized]);

  // Save when debounced content changes
  useEffect(() => {
    const saveContent = async () => {
      if (
        chapterId &&
        isInitialized &&
        debouncedContent !== lastSavedContent &&
        !isSaving &&
        debouncedContent !== ""
      ) {
        try {
          setIsSaving(true);
          await updateChapter({
            chapterId: chapterId as Id<"bookChapters">,
            content: debouncedContent
          });
          setLastSavedContent(debouncedContent);
        } catch (error) {
          console.error("Failed to save chapter:", error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    saveContent();
  }, [debouncedContent, chapterId, updateChapter, lastSavedContent, isInitialized, isSaving]);

  const handleDelete = useCallback(async () => {
    if (chapterId && !isDeleting) {
      try {
        setIsDeleting(true);
        await deleteChapter({
          chapterId: chapterId as Id<"bookChapters">
        });
        closeDialog();
      } catch (error) {
        console.error("Failed to delete chapter:", error)
      } finally {
        setIsDeleting(false);
      }
    }
  }, [chapterId, deleteChapter, closeDialog, isDeleting])

  // Handle content changes
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
      setContent("")
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="flex md:hidden z-100">
        <DialogHeader>
          <DialogTitle>
            Open on Desktop please!
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
      <DialogContent className="h-dvh w-dvw gap-0 min-w-full rounded-none border-none p-0 flex-col items-center hidden md:flex">
        <div className="grid grid-cols-2 w-full max-w-7xl flex-1 border-x min-h-0">
          <div className="border-r overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
              <CodeMirror
                value={content}
                onChange={handleContentChange}
                lang="markdown"
                style={{
                  fontSize: 16
                }}
                extensions={[
                  markdown(),
                  EditorView.lineWrapping
                ]}
                theme={githubDarkInit({
                  settings: {
                    background: "#1f1f1f",
                    gutterBackground: "#1f1f1f",
                  }
                })}
                height="100%"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              {mdxSource && (
                <div className="prose prose-sm max-w-none">
                  <MDXRemote {...mdxSource} components={components} />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="border-t p-4 w-full max-w-7xl border-x flex-shrink-0">
          {isSaving && (
            <Button
              className="w-9 pointer-events-none"
              variant="ghost"
            >
              <Loader className="animate-spin"/>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                variant="secondary"
                disabled={isDeleting || isSaving}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Once deleted, this chapter and its content will be gone forever. You won&apos;t be able to recover it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <DialogFooter>
                <AlertDialogCancel className="border-none">
                  Cancel
                </AlertDialogCancel>
                <Button
                  variant="destructive"
                >
                  Delete
                </Button>
              </DialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            variant="secondary"
            onClick={closeDialog}
            disabled={isSaving}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
 
export default EditBookChapter;