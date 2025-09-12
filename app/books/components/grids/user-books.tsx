"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Book from "../cards/book";
import { useRouter } from "next/navigation";

interface UserBooksProps {
  userId: string;
};

const UserBooks: React.FC<UserBooksProps> = ({ userId }) => {
  const router = useRouter();

  const userBooks = useQuery(api.bookFunctions.getUserBooks, {
    userId: userId
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Results */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {userBooks?.map((book) => (
          <Book 
            key={book._id}
            title={book.title}
            creationTime={book._creationTime}
            onClick={() => router.push(`/books/${book._id}`)}
          />
        ))} 
      </div>
    </div>
  );
};

export default UserBooks;