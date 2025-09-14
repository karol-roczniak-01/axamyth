import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditTarget } from "../../hooks/use-edit-target";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCallback, useEffect, useState } from "react";
import TargetBooks from "../grids/target-books";
import { Input } from "@/components/ui/input";
import { useBuyAd } from "../../hooks/use-buy-ad";

const EditTarget = () => {
  const { 
    isOpen, 
    userId, 
    userEmail, 
    adId, 
    closeDialog 
  } = useEditTarget();
  const buyAd = useBuyAd();
   
  // Search states (no URL updates)
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input (no URL updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }, [])

  const onChange = (open: boolean) => {
    if (!open) {
      setSearchInput("");
      setDebouncedSearch("");
      closeDialog();
    }
  };

  // Why onChange is not resetting correclty and need this useEffect? (TODO)
  useEffect(() => {
    if (isOpen) {
      setSearchInput("");
      setDebouncedSearch("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="h-dvh gap-0 min-w-full rounded-none border-none p-0 flex flex-col items-center">
        <DialogHeader className="p-4 items-start flex w-full">
          <VisuallyHidden>
            <DialogTitle>
              Edit Ad
            </DialogTitle>
          </VisuallyHidden>
          <Button 
            variant="link"
            onClick={closeDialog}
          >
            <X />
            Close
          </Button>
                    
        </DialogHeader>
        <div className="flex-1 w-full flex justify-center border-y">
          <div className="w-full h-full max-w-6xl grid grid-cols-2">
            {/* Left panel - Books search */}
            <div className="border-r p-6 flex flex-col gap-4">
              <div className="relative">
                <Search 
                  className="absolute top-[9px] left-[14px] text-muted-foreground"
                  size={18}
                />
                <Input
                  className="pl-10"
                  placeholder="Find a book..."
                  value={searchInput}
                  onChange={handleInputChange}
                />
              </div>
              <TargetBooks 
                searchTerm={debouncedSearch}
                onClick={() => buyAd.openDialog(userId!, userEmail!, adId!, )}
              />
            </div>

            {/* Right panel - Current books */}
            <div>
             
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 w-full max-w-2xl">
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
   
);
}

export default EditTarget;