import { create } from 'zustand'

interface EditChapter {
  isOpen: boolean
  bookId: string | null
  chapterId: string | null
  openDialog: (bookId: string, chapterId: string) => void
  closeDialog: () => void
}

export const useEditChapter = create<EditChapter>((set) => ({
  isOpen: false,
  bookId: null,
  chapterId: null,
  openDialog: (bookId: string, chapterId: string) => 
    set({ isOpen: true, bookId, chapterId }),
  closeDialog: () => 
    set({ isOpen: false, bookId: null, chapterId: null }),
}))