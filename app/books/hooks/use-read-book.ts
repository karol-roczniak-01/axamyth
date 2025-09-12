import { create } from 'zustand'

interface ReadBook {
  isOpen: boolean
  bookId: string | null
  chapterId: string | null
  chapters: any[] | null
  openDialog: (bookId: string, chapterId: string, chapters: any[]) => void
  closeDialog: () => void
}

export const useReadBook = create<ReadBook>((set) => ({
  isOpen: false,
  bookId: null,
  chapterId: null,
  chapters: null,
  openDialog: (bookId: string, chapterId: string, chapters: any[]) => 
    set({ isOpen: true, bookId, chapterId, chapters }),
  closeDialog: () => 
    set({ isOpen: false, bookId: null, chapterId: null, chapters: null }),
}))