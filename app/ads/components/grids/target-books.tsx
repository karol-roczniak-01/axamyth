"use client";

import SmallBook from "@/app/books/components/cards/small-book";
import SmallBookSkeleton from "@/app/books/components/cards/small-book-skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";

interface TargetBooksProps {
  searchTerm: string;
  onClick: () => void;
}

const TargetBooks: React.FC<TargetBooksProps> = ({
  searchTerm,
  onClick
}) => {
  const numberOfBooks = 6;

  const { results, status, loadMore } = usePaginatedQuery(
    api.bookFunctions.getBooksByTitle,
    { title: searchTerm },
    { initialNumItems: numberOfBooks }
  );

  // Create array of skeletons based on numberOfBooks
  const renderSkeletons = () => {
    return Array.from({ length: numberOfBooks }, (_, index) => (
      <SmallBookSkeleton key={`skeleton-${index}`} />
    ));
  };

  return ( 
    <div className="flex flex-col gap-4">
      {/* Results */}
      <div className="flex flex-col gap-4">
        {status === 'LoadingFirstPage' ? (
          renderSkeletons()
        ) : (
          <>
            {results?.map((book) => (
              <SmallBook 
                key={book._id}
                title={book.title}
                onClick={onClick}
              />
            ))}
            {status === 'LoadingMore' && (
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
        <span className="text-center text-sm text-muted-foreground">
          No books found for "{searchTerm}"
        </span>
      )}

      {/* Empty State */}
      {!searchTerm && (
        <span className="text-center text-sm text-muted-foreground">
          Enter a title in the search to find results
        </span>
      )}
    </div>
   );
}
 
export default TargetBooks;