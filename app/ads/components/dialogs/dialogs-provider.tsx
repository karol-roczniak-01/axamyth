"use client"

import { useEffect, useState } from "react";
import EditAd from "./edit-ad";
import EditTarget from "./edit-target";

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
      <EditAd />
      <EditTarget />
    </>
  );
};