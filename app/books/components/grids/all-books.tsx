"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import Book from "../cards/book";
import { useRouter } from "next/navigation";
import BookSkeleton from "../cards/book-skeleton";

interface AllBooksProps {
  searchTerm: string;
}

const AllBooks: React.FC<AllBooksProps> = ({ searchTerm }) => {
  const router = useRouter();
  
  const numberOfBooks = 12;

  const { results, status, loadMore } = usePaginatedQuery(
    api.bookFunctions.getBooksByTitle,
    { title: searchTerm },
    { initialNumItems: numberOfBooks }
  );

  // Create array of skeletons based on numberOfBooks
  const renderSkeletons = () => {
    return Array.from({ length: numberOfBooks }, (_, index) => (
      <BookSkeleton key={`skeleton-${index}`} />
    ));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {status === 'LoadingFirstPage' && searchTerm ? (
          // Show skeletons while loading initial data
          renderSkeletons()
        ) : (
          <>
            {results?.map((book) => (
              <Book 
                key={book._id}
                title={book.title}
                creationTime={book._creationTime}
                onClick={() => router.push(`/books/${book._id}`)}
              />
            ))}
            {status === 'LoadingMore' && (
              // Show skeletons when loading more
              renderSkeletons()
            )}
          </>
        )}
      </div>

      {/* Load More Button */}
      {status === "CanLoadMore" && (
        <div className="flex justify-center">
          <Button 
            className="rounded-full"
            onClick={() => loadMore(numberOfBooks)}
            variant="outline"
          >
            Load More
          </Button>
        </div>
      )}

      {/* No Results */}
      {results?.length === 0 && searchTerm && (status !== "LoadingMore" && status !== "LoadingFirstPage") && (
        <span className="text-center text-muted-foreground">
          No books found for "{searchTerm}"
        </span>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <span className="text-center text-muted-foreground">
          Enter a title in the search to find results
        </span>
      )}
    </div>
  );
};

export default AllBooks;