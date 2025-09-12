import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditBook } from "../../hooks/use-edit-book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { iso, z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

// Zod schema for form validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
});

type BookFormData = z.infer<typeof bookSchema>;

const EditBook = () => {
  const { 
    isOpen,
    bookId,
    bookTitle,
    closeDialog
  } = useEditBook();

  const editBook = useMutation(api.bookFunctions.editBook);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: ""
    }
  });

  // Propagate bookTitle to form when it changes
  useEffect(() => {
    if (bookTitle) {
      reset({ title: bookTitle });
    }
  }, [bookTitle, reset]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset({ title: "" });
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: BookFormData) => {
    if (!bookId) return;

    try {
      await editBook({
        bookId: bookId as Id<"books">,
        title: data.title
      });
      closeDialog();
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            Update Book
          </DialogTitle>
          <DialogDescription>
            Make your changes and click &apos;Save&apos; to update the book.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label>
                Title
              </Label>
              <Input
                {...register("title")}
                placeholder="Book title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive -mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Close
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
   );
}
 
export default EditBook;