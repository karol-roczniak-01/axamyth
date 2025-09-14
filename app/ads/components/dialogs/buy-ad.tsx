import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBuyAd } from "../../hooks/use-buy-ad";
import StripeElementsCheckout from "@/components/checkout";

const BuyAd = () => {
  const { isOpen, adId, closeDialog  } = useBuyAd();

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            BUY!
          </DialogTitle>
        </DialogHeader>
        <StripeElementsCheckout />
      </DialogContent>
    </Dialog>
   );
}
 
export default BuyAd;