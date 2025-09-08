import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditBookChapter = () => {

  return ( 
    <Dialog >
      <DialogContent className="h-dvh gap-0 min-w-full rounded-none border-none p-0 flex flex-col items-center">
        <DialogHeader className="p-4 w-full max-w-2xl">
          <DialogTitle className="font-serif text-2xl">
            
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 border-y overflow-auto w-full flex justify-center">
          <div className="w-full max-w-2xl p-4"> 
            
          </div>
        </div>
        <DialogFooter className="p-4 w-full max-w-2xl">
          <Button>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
   );
}
 
export default EditBookChapter;