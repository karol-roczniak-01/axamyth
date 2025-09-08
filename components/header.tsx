"use client";

import { Home } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return ( 
    <header className="p-4">
      <Button
        className="w-9"
        variant="ghost"
      >
        <Home />
      </Button>
    </header>
   );
}
 
export default Header;