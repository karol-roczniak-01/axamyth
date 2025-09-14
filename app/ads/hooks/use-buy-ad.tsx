import { create } from 'zustand'

interface BuyAd {
  isOpen: boolean
  adId: string | null
  openDialog: (adId: string) => void
  closeDialog: () => void
}

export const useBuyAd = create<BuyAd>((set) => ({
  isOpen: false,
   adId: null,
  openDialog: (adId: string) => 
    set({ isOpen: true, adId }),
  closeDialog: () => 
    set({ isOpen: false, adId: null }),
}))