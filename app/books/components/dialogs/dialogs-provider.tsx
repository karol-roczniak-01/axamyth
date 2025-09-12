"use client"

import { useEffect, useState } from "react";
import EditBookChapter from "./edit-book-chapter";
import ReadBook from "./read-book";
import EditBook from "./edit-book";

export const DialogsProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  };
  
  return (
    <>
      <EditBook />
      <EditBookChapter />
      <ReadBook />
    </>
  );
};