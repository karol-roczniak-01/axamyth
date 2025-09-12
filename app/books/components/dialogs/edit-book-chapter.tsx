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
import { Loader, Trash, Trash2, X } from "lucide-react";
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { components } from "../mdx-components";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const EditBookChapter = () => {
  const { isOpen, chapterId, closeDialog } = useEditChapter();
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [lastLoadedChapterId, setLastLoadedChapterId] = useState<string | null>(null);
     
  const bookChapter = useQuery(
    api.bookChapterFunctions.getBookChapterById, 
    chapterId ? { chapterId: chapterId as Id<"bookChapters"> } : "skip"
  );
  const updateChapter = useMutation(api.bookChapterFunctions.updateBookChapterContent);
  const deleteChapter = useMutation(api.bookChapterFunctions.deleteBookChapter);
  const updateChapterTitle = useMutation(api.bookChapterFunctions.updateBookChapterTitle);

  // Always debounce content, but only save if user has edited
  const [debouncedContent] = useDebounce(content, 1000);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setContent("");
      setOriginalContent("");
      setHasUserEdited(false);
      setIsSaving(false);
      setMdxSource(null);
      setLastLoadedChapterId(null);
    }
  }, [isOpen]);

  // Load content when chapter loads (only if it's a new chapter or content changed)
  useEffect(() => {
    if (
      isOpen && 
      bookChapter?.content !== undefined && 
      chapterId &&
      (lastLoadedChapterId !== chapterId || originalContent !== bookChapter.content)
    ) {
      setContent(bookChapter.content);
      setOriginalContent(bookChapter.content);
      setHasUserEdited(false);
      setLastLoadedChapterId(chapterId);
    }
  }, [bookChapter?.content, chapterId, isOpen, lastLoadedChapterId, originalContent]);

  // Process MDX for preview
  useEffect(() => {
    const processMdx = async () => {
      if (content && isOpen) {
        try {
          const mdxSource = await serialize(content);
          setMdxSource(mdxSource);
        } catch (error) {
          console.error("Failed to process MDX:", error);
          setMdxSource(null);
        }
      } else {
        setMdxSource(null);
      }
    };
    processMdx();
  }, [content, isOpen]);

  // Auto-save only when user has made changes
  useEffect(() => {
    const saveContent = async () => {
      if (
        chapterId &&
        hasUserEdited &&
        debouncedContent !== originalContent &&
        !isSaving &&
        isOpen // Only save when dialog is open
      ) {
        try {
          setIsSaving(true);
          await updateChapter({
            chapterId: chapterId as Id<"bookChapters">,
            content: debouncedContent
          });
          setOriginalContent(debouncedContent); // Update what we consider "saved"
        } catch (error) {
          console.error("Failed to save chapter:", error);
        } finally {
          setIsSaving(false);
        }
      }
    };

    saveContent();
  }, [debouncedContent, chapterId, updateChapter, originalContent, hasUserEdited, isSaving, isOpen]);

  const handleDelete = useCallback(async () => {
    if (chapterId && !isDeleting) {
      try {
        setIsDeleting(true);
        await deleteChapter({
          chapterId: chapterId as Id<"bookChapters">
        });
        closeDialog();
      } catch (error) {
        console.error("Failed to delete chapter:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [chapterId, deleteChapter, closeDialog, isDeleting]);

  const handleSaveTitle = async (e: React.FormEvent<HTMLInputElement>) => {
    const newTitle = e.currentTarget.value.trim();
    if (newTitle && newTitle !== bookChapter?.title) {
      await updateChapterTitle({
        chapterId: chapterId as Id<"bookChapters">,
        title: newTitle
      });
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    setHasUserEdited(true); // Mark that user has made changes
  }, []);
  
  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  // Show loading state while waiting for chapter data
  const isLoading = isOpen && chapterId && (!bookChapter || lastLoadedChapterId !== chapterId);

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="flex md:hidden z-100">
        <DialogHeader>
          <DialogTitle>Open on Desktop please!</DialogTitle>
        </DialogHeader>
      </DialogContent>
      
      <DialogContent className="h-dvh w-dvw gap-0 min-w-full rounded-none border-none p-0 flex-col items-center hidden md:flex focus:outline-none focus:ring-0">        
        <VisuallyHidden>
          <DialogTitle>
            Edit Chapter
          </DialogTitle>
        </VisuallyHidden>
      
        <DialogHeader className="border-b w-full p-4 flex items-start">
          <Button 
            variant="link" 
            className="top-4 left-4"
            disabled={Boolean(isSaving || isLoading)}
            onClick={closeDialog}
          >
            <X />
             Close
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-2 w-full max-w-7xl flex-1 border-x min-h-0">
          <div className="border-r overflow-hidden flex flex-col">
            <div className="border-b px-3">
              {isEditingTitle ? (
                <input
                  placeholder="Enter title here..."
                  autoFocus
                  defaultValue={bookChapter?.title}
                  onBlur={handleSaveTitle}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-sm font-mono px-0 dark:bg-transparent rounded-none border-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                />
              ) : (
                <p 
                  className="h-8 text-sm hover:text-muted-foreground transition flex items-center font-mono cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {bookChapter?.title}
                </p>
              )}
            </div>
            <div className="flex-1 overflow-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <CodeMirror
                  value={content}
                  onChange={handleContentChange}
                  extensions={[markdown(), EditorView.lineWrapping]}
                  theme={githubDarkInit({
                    settings: {
                      
                      background: "#1f1f1f",
                      gutterBackground: "#1f1f1f",
                    }
                  })}
                  style={{ fontSize: 16 }}
                  height="100%"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>
          
          <div className="overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                mdxSource && (
                  <div className="prose prose-sm max-w-none">
                    <MDXRemote {...mdxSource} components={components} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="border-t p-4 w-full">
          <div className="max-w-7xl mx-auto w-full flex">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  disabled={Boolean(isSaving || isLoading)}
                >
                  <Trash2 />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Once deleted, this chapter and its content will be gone forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-none">Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookChapter;