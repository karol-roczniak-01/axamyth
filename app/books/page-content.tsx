"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Book, BookUser, EllipsisVertical, Loader, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import AllBooks from "./components/grids/all-books";
import UserBooks from "./components/grids/user-books";

interface PageContentProps {
  userId: string;
}

type ViewMode = 'all' | 'user';

// Main PageContent Component
const PageContent: React.FC<PageContentProps> = ({ userId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Book creation
  const createBook = useMutation(api.bookFunctions.createBook);
  const [isCreating, setIsCreating] = useState(false);

  // Get initial values from URL
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<ViewMode>(
    (searchParams.get('view') as ViewMode) || 'all'
  );

  // Handle create new book
  const handleCreateNewBook = async () => {
    setIsCreating(true);
        
    try {
      const newBookId = await createBook({
        userId: userId,
        title: "My new book"
      });
      router.push(`/books/${newBookId}`)

    } catch (error) {
      console.error("Failed to create new book:", error);
    } finally {
      setIsCreating(false); 
    }
  };

  // Debounce search input and update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      
      // Update URL with search query and view mode
      const trimmedSearch = searchInput.trim();
      const currentParams = new URLSearchParams(window.location.search);
      
      if (trimmedSearch) {
        currentParams.set('q', trimmedSearch);
      } else {
        currentParams.delete('q');
      }
      
      currentParams.set('view', viewMode);
      
      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      if (newUrl !== window.location.href) {
        router.replace(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, viewMode, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  return (
    <div className="h-dvh w-full flex flex-col">
      {/* Header - Fixed */}
      <header className="p-4 border-b sticky top-0 z-10">
        <Button
          variant="link"
          onClick={() => router.push('/')}
        >
          <ArrowLeft />
          Home
        </Button>
      </header>
            
      {/* Search - Fixed */}
      <div className="w-full flex justify-center border-b sticky z-10">
        <div className={`${viewMode === 'user' && 'justify-end'} max-w-2xl w-full flex gap-2 relative p-4`}>
          {viewMode === 'all' && (
            <>
              <Search 
                className="absolute top-[29px] left-[32px] text-muted-foreground"
                size={18}
              />
              <Input
                className="rounded-full h-11 px-4 pl-12 text-base"
                placeholder="Find a book..."
                value={searchInput}
                onChange={handleInputChange}
              />
            </>
          )}
          {viewMode === 'user' && (
            <Button 
              className="h-11 rounded-full [&_svg:not([class*='size-'])]:size-5"
              size="lg"
              disabled={isCreating}
              onClick={handleCreateNewBook}
            >
              {isCreating ? <Loader className="animate-spin"/> : <Plus />}
              {isCreating ? 'Adding' : 'Add'}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="rounded-full h-11 w-11 [&_svg:not([class*='size-'])]:size-5"
                variant="outline"
              >
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className={`${viewMode === 'all' && 'bg-accent'}`}
                onClick={() => handleViewModeChange('all')}
              >
                <Book />
                All Books
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${viewMode === 'user' && 'bg-accent'}`}
                onClick={() => handleViewModeChange('user')}
              >
                <BookUser />
                My Books
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
            
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl p-4 mx-auto">
          {viewMode === 'all' ? (
            <AllBooks searchTerm={debouncedSearch} />
          ) : (
            <UserBooks userId={userId} />
          )}
        </div>
      </div>
      
    </div>
  );
};

export default PageContent;