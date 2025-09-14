import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBuyAd } from "../../hooks/use-buy-ad";
import StripeElementsCheckout from "@/components/checkout";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdPackage {
  id: string;
  adCount: number;
  price: number // in cents
  displayPrice: string;
};

interface PaymentSuccess {
  paymentIntentId: string;
  timestamp: Date;
  selectedPackage: AdPackage;
}

const BuyAd = () => {
  const { isOpen, userId, userEmail, adId, closeDialog } = useBuyAd();
  const [currentStep, setCurrentStep] = useState<'select' | 'payment'>('select');
  const [selectedPackage, setSelectedPackage] = useState<AdPackage | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<PaymentSuccess | null>(null);

  // CPM settings (CPM is $10, so price (adCount/1000)*10*100 (cuz of cents))
  const adPackages: AdPackage[] = [
    {
      id: 'test',
      adCount: 1000,
      price: 0, // $0.00
      displayPrice: '$0.00'
    },
    {
      id: 'basic',
      adCount: 1000,
      price: 1000, // $10.00
      displayPrice: '$10.00'
    },
    {
      id: 'standard',
      adCount: 5000,
      price: 5000, // $50.00
      displayPrice: '$50.00',
    },
    {
      id: 'premium',
      adCount: 10000,
      price: 10000, // $100.00
      displayPrice: '$100.00'
    }
  ]
  
  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
      // Reset all states when dialog closes
      setCurrentStep('select');
      setSelectedPackage(null);
      setPaymentSuccess(null);
    }
  };

  const handlePackageSelect = (adPackage: AdPackage) => {
    setSelectedPackage(adPackage);
  };

  const handleNext = () => {
    if (selectedPackage) {
      setCurrentStep('payment');
    }
  };
  
  const handleBack = () => {
    setCurrentStep('select');
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentSuccess({
      paymentIntentId,
      timestamp: new Date(),
      selectedPackage: selectedPackage!
    });
    
    // Optional: Auto-close dialog after a delay
    // setTimeout(() => {
    //   closeDialog();
    // }, 3000);
  };

  const getDialogTitle = () => {
    if (paymentSuccess) return 'Purchase Successful!';
    if (currentStep === 'payment') return 'Complete Your Purchase';
    return 'Select Ad Package';
  };

  const getDialogDescription = () => {
    if (currentStep === 'payment') return;
    return 'Select Ad Package'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent showCloseButton className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>
        
        {paymentSuccess ? (
          <span>
            Success!
          </span>
        ) : currentStep === 'select' ? (
          <>
          
          </>
        ) : (
          <StripeElementsCheckout
            userEmail={userEmail!}
            adId={adId!}
            amount={selectedPackage?.price!}
            onSuccess={handlePaymentSuccess}
          />
        )}
        <DialogFooter>
          <Button
            onClick={closeDialog}
            variant="secondary"
          >
            Close
          </Button>
          <Button 
            disabled={!selectedPackage} 
            onClick={handleNext}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyAd;