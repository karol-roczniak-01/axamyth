"use client"

import { useEffect, useState } from "react";
import EditBookChapter from "./dialogs/edit-book-chapter";

export const BookDialogsProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  };
  
  return (
    <>
      <EditBookChapter />
    </>
  );
};