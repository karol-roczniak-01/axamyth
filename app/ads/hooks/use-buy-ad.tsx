import { create } from 'zustand'

interface BuyAd {
  isOpen: boolean
  userId: string | null
  userEmail: string | null
  adId: string | null
  openDialog: (userId: string, userEmail: string, adId: string) => void
  closeDialog: () => void
}

export const useBuyAd = create<BuyAd>((set) => ({
  isOpen: false,
  userId: null,
  userEmail: null,
  adId: null,
  openDialog: (userId: string, userEmail: string, adId: string) => 
    set({ isOpen: true, userId, userEmail, adId }),
  closeDialog: () => 
    set({ isOpen: false, userId: null, userEmail: null, adId: null }),
}))