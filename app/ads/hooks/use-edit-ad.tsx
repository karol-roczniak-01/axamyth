import { create } from 'zustand'

interface EditAd {
  isOpen: boolean
  adId: string | null
  adLayout: string | null
  adTitle: string | null
  adDescription: string | null
  adPrice: number | null
  adButtonText: string | null
  adButtonUrl: string | null
  adImagePath: string | null
  adImageUrl: string | null
  openDialog: (
    adId: string, 
    adLayout: string,
    adTitle: string, 
    adDescription: string,
    adPrice: number,
    adButtonText: string,
    adButtonUrl: string,
    adImagePath: string,
    adImageUrl: string,
  ) => void
  closeDialog: () => void
}

export const useEditAd = create<EditAd>((set) => ({
  isOpen: false,
  adId: null,
  adLayout: null,
  adTitle: null,
  adDescription: null,
  adPrice: null,
  adButtonText: null,
  adButtonUrl: null,
  adImagePath: null,
  adImageUrl: null,
  openDialog: (
    adId: string,
    adLayout: string,
    adTitle: string, 
    adDescription: string,
    adPrice: number,
    adButtonText: string,
    adButtonUrl: string,
    adImagePath: string,
    adImageUrl: string
  ) => 
    set({ 
      isOpen: true, 
      adId, 
      adLayout,
      adTitle, 
      adDescription,
      adPrice,
      adButtonText,
      adButtonUrl,
      adImagePath,
      adImageUrl
    }),
  closeDialog: () => 
    set({ 
      isOpen: false, 
      adId: null, 
      adLayout: null,
      adTitle: null, 
      adDescription: null,
      adPrice: null,
      adButtonText: null,
      adButtonUrl: null,
      adImagePath: null,
      adImageUrl: null
    }),
}))