import { create } from 'zustand'

interface EditBook {
  isOpen: boolean
  bookId: string | null
  bookTitle: string | null
  openDialog: (bookId: string, bookTitle: string) => void
  closeDialog: () => void
}

export const useEditBook = create<EditBook>((set) => ({
  isOpen: false,
  bookId: null,
  bookTitle: null,
  openDialog: (bookId: string, bookTitle: string) => 
    set({ isOpen: true, bookId, bookTitle }),
  closeDialog: () => 
    set({ isOpen: false, bookId: null, bookTitle: null }),
}))