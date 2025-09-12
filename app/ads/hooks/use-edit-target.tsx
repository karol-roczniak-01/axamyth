import { create } from 'zustand'

interface EditTarget {
  isOpen: boolean
  adId: string | null
  openDialog: (adId: string) => void
  closeDialog: () => void
}

export const useEditTarget = create<EditTarget>((set) => ({
  isOpen: false,
   adId: null,
  openDialog: (adId: string) => 
    set({ isOpen: true, adId }),
  closeDialog: () => 
    set({ isOpen: false, adId: null }),
}))