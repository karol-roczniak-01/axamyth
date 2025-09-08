"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import Book from "./cards/book";
import { useRouter } from "next/navigation";
import BookSkeleton from "./cards/book-skeleton";

interface UserBooksProps {
  userId: string;
  searchTerm: string;
};

const UserBooks: React.FC<UserBooksProps> = ({ userId, searchTerm }) => {
  const router = useRouter();

  const numberOfBooks = 12;

  // Use different queries based on whether there's a search term
  const searchResults = usePaginatedQuery(
    api.bookFunctions.getUserBooksByTitle,
    searchTerm ? { userId, title: searchTerm } : "skip",
    { initialNumItems: numberOfBooks }
  );

  const allBooksResults = usePaginatedQuery(
    api.bookFunctions.getAllUserBooks,
    !searchTerm ? { userId } : "skip",
    { initialNumItems: numberOfBooks }
  );

  // Use the appropriate result set
  const { results, status, loadMore } = searchTerm ? searchResults : allBooksResults;

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
        {status === 'LoadingFirstPage' ? (
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
              Array.from({ length: numberOfBooks }, (_, index) => (
                <BookSkeleton key={`loading-more-${index}`} />
              ))
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
      {results?.length === 0 && searchTerm && (
        <span className="text-center text-muted-foreground">
          No books found for "{searchTerm}"
        </span>
      )}

      {/* Empty State */}
      {results?.length === 0 && !searchTerm && (
        <span className="text-center text-muted-foreground">
          You haven't added any books yet
        </span>
      )}
    </div>
  );
};

export default UserBooks;