import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditAd } from "../../hooks/use-edit-ad";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, X } from "lucide-react";
import z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";

// Zod schema for form validation
const adSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  price: z.number("Price must be a number").min(0, "Price must be positive").optional(),
  description: z.string().min(10, "Description is required").max(100).trim(),
  buttonText: z.string().min(1, "Button text is required").max(20, "Button text must be 20 characters or less").trim(),
  buttonUrl: z.string().min(1, "Button URL is required"),
});

type AdFormData = z.infer<typeof adSchema>;

const EditAd = () => {z
  const {
    isOpen,
    adId,
    adLayout,
    adTitle,
    adPrice,
    adButtonText,
    adButtonUrl,
    adDescription,
    adImagePath,
    adImageUrl,
    closeDialog
  } = useEditAd();
  const editAd = useMutation(api.adFunctions.editAd);
  const generateUploadUrl = useMutation(api.storageFunctions.generateUploadUrl)

  // State for image handling
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
    watch
  } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      price: undefined,
      description: "",
      buttonText: "",
      buttonUrl: ""
    }
  });

  // Watch form values for live preview
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");
  const watchedPrice = watch("price");
  const watchedButtonText = watch("buttonText");
  const watchedButtonUrl = watch("buttonUrl")

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  // Clean up preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Propagate ad details to form when it changes
  useEffect(() => {
    if (adId) {
      reset({
        title: adTitle || '',
        price: adPrice || undefined,
        description: adDescription || '',
        buttonText: adButtonText || '',
        buttonUrl: adButtonUrl || '',
      });
    }
  }, [
    adId, 
    adTitle, 
    adDescription,
    adButtonText,
    adButtonUrl,
    reset
  ]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      reset({
        title: "",
        price: undefined,
        description: "",
        buttonText: "",
        buttonUrl: ""
      });
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, reset, previewUrl]);

  const removeImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: AdFormData) => {
    if (!adId) return;

    try {
      let imagePath: string | undefined;

      // Upload image first if one is selected
      if (selectedImage) {
        // Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload the file
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });

        const { storageId } = await result.json();
        imagePath = storageId;
      }

      // Update the ad with for data and image path
      await editAd({
        adId: adId as Id<"ads">,
        layout: "single-item",
        title: data.title,
        price: data.price,
        description: data.description,
        buttonText: data.buttonText,
        buttonUrl: data.buttonUrl,
        ...(imagePath && { imagePath })
      });
      // closeDialog();
    } catch (error) {
      console.error("Failed to update ad:", error);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return ( 
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="h-dvh gap-0 min-w-full rounded-none border-none p-0 flex flex-col items-center">
        <DialogHeader className="p-4 items-start flex w-full">
          <VisuallyHidden>
            <DialogTitle>
              Edit Ad
            </DialogTitle>
          </VisuallyHidden>
          <Button 
            variant="link" 
            onClick={closeDialog}
          >
            <X />
            Close
          </Button>
        </DialogHeader>
        <div className="flex-1 w-full flex justify-center border-y">
          <div className="w-full h-full max-w-6xl grid grid-cols-2 border-x">
            {/* Left panel - Form */}
            <div className="border-r p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 h-full">
                
                {/* Layout selection */}
                <Carousel>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-1 flex items-center">
                      <CarouselPrevious type="button" className="static -translate-y-0"/>
                    </div>
                    <div className="col-span-10">
                      <CarouselContent className="pb-1">
                        <CarouselItem className="basis-2/3">
                          <Card 
                            className={`
                              cursor-pointer hover:bg-card/70 transition 
                              ${adLayout === 'single-item' && 'border-foreground bg-input/50 hover:bg-input/50'}
                            `} 
                            id="single-item"
                          >
                            <CardHeader>
                              <CardTitle className="text-sm font-serif">
                                Single Item
                              </CardTitle>
                              <CardDescription>
                                Ideal for physical or digital products with a fixed price
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </CarouselItem>
                        <CarouselItem className="basis-2/3">
                          <Card id="single-item" className="opacity-50 flex items-center justify-center h-full">
                            Soon
                          </Card>
                        </CarouselItem>
                        <CarouselItem className="basis-2/3">
                          <Card id="single-item" className="opacity-50 flex items-center justify-center h-full">
                            Soon
                          </Card>
                        </CarouselItem>
                      </CarouselContent>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <CarouselNext type="button" className="static -translate-y-0"/>
                    </div>
                  </div>
                </Carousel>

                {/* Separator */}
                <div className="h-[1px] w-full bg-border"/>

                <div className="flex h-full justify-between w-full">
                  <div className="space-y-4 w-full h-full flex-1">
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                      <Label>
                        Title
                      </Label>
                      <Input
                        {...register("title")}
                        placeholder="Ad title"
                        className={errors.title ? "border-destructive" : ""}
                      />
                      {errors.title && (
                        <p className="text-sm text-destructive -mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>
                    {/* Price */}
                    <div className="flex flex-col gap-2">
                      <Label>
                        Price
                      </Label>
                      <Input
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        placeholder="50"
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive -mt-1">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                    {/* Description */}
                    <div className="flex flex-col gap-2">
                      <Label>
                        Description
                      </Label>
                      <Textarea
                        {...register("description")}
                        placeholder="Ad description"
                        className={errors.description ? "border-destructive resize-none" : " resize-none"}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive -mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    {/* Button */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-2">
                        <Label>
                          Button Text
                        </Label>
                        <Input
                          {...register("buttonText")}
                          placeholder="Learn more"
                          className={errors.buttonText ? "border-destructive" : ""}
                        />
                        {errors.buttonText && (
                          <p className="text-sm text-destructive -mt-1">
                            {errors.buttonText.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>
                          Button URL
                        </Label>
                        <Input
                          {...register("buttonUrl")}
                          placeholder="https://my-website.com"
                          className={errors.title ? "border-destructive" : ""}
                        />
                        {errors.buttonUrl && (
                          <p className="text-sm text-destructive -mt-1">
                            {errors.buttonUrl.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Image Upload Section */}
                    <div className="flex flex-col gap-2">
                      <Label>Image</Label>
                      
                      {!selectedImage ? (
                        <div
                          {...getRootProps()}
                          className={`border border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${
                            isDragActive 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted-foreground/25 hover:border-primary/50'
                          }`}
                        >
                          <input {...getInputProps()} />
                          <Upload size={18} className="mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {isDragActive
                              ? "Drop the image here..."
                              : "Drag & drop an image here, or click to select"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, JPEG, GIF, WebP up to 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center gap-3">
                              {previewUrl && (
                                <Image 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="w-16 h-16 object-cover rounded-sm"
                                  width={64}
                                  height={64}
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-sm font-medium">{selectedImage.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button 
                                type="button"
                                variant="ghost" 
                                onClick={removeImage}
                                className="text-destructive w-8 h-8 hover:text-destructive"
                              >
                                <Trash2 />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Button moved to bottom */}
                <div className="mt-auto pt-4 justify-end flex">
                  <Button 
                    type="submit"
                    disabled={isSubmitted}
                    className="w-fit"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Right panel - Live Preview */}
            <div className="overflow-hidden relative flex flex-col items-center justify-center p-12">
              <div className="absolute z-20 flex flex-col top-0 opacity-10 p-6">
                <span className="indent-6 font-serif text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sollicitudin porta orci, sit amet pretium lacus consectetur sagittis. Morbi id luctus metus. Maecenas porttitor et massa id consequat. Nullam eu facilisis ipsum. Vivamus in auctor neque. Fusce pretium dolor eu augue feugiat finibus. Morbi cursus sed libero ut hendrerit. Aliquam eget lacinia dolor. Mauris cursus felis ante, ac euismod lectus efficitur vel. Nulla ligula tortor, fermentum nec eros vitae, tincidunt molestie libero. Etiam pharetra, magna sed varius maximus, nisl enim semper dolor, a facilisis nibh lectus nec libero. Curabitur vestibulum, velit eu imperdiet ultrices, mi nisi pulvinar leo, sit amet dapibus tellus nibh sit amet sapien. Mauris non convallis arcu, et lobortis metus. Mauris consequat risus non purus sagittis, ut pulvinar lacus fermentum. Cras lobortis nulla eu justo viverra, a imperdiet nulla elementum. Aliquam efficitur pulvinar ante ac rutrum.
                </span>
                <span className="indent-6 font-serif text-justify">
                  Vivamus viverra odio non dolor consectetur, consequat maximus nisl vulputate. Integer quis est convallis, rhoncus mi id, dictum justo. Duis bibendum quis quam ac pulvinar. Phasellus vitae tortor pulvinar mi scelerisque tempor. Maecenas eu turpis vitae ex pretium euismod lobortis at ipsum. Sed vestibulum elit justo, eu vehicula massa dictum vel. Phasellus sit amet condimentum ex, nec tristique nisi. Phasellus ultrices gravida metus, ac egestas nulla congue eget. Integer laoreet dolor leo, id blandit mauris imperdiet a. Proin dapibus sed justo sed ullamcorper. Suspendisse tempor ligula ac lacus lobortis, vestibulum venenatis quam interdum. Proin nisl leo, interdum et ante ut, vestibulum blandit ligula.
                </span>
                <span className="indent-6 font-serif text-justify">
                  Curabitur molestie, metus at maximus accumsan, justo quam viverra leo, ac scelerisque nisi dui a arcu. Nunc in commodo nisl. Donec quis erat est. Curabitur at laoreet dui, eu ultrices magna. Sed a aliquet ex. Nam semper dolor nec lacinia faucibus. Phasellus laoreet odio vel convallis condimentum.
                </span>
              </div>
              <Card className="col-span-8 w-full z-40">
                <CardContent>
                  <div className="flex gap-6">
                    <div className="w-22 h-22 shrink-0 rounded-lg bg-accent overflow-hidden">
                      {previewUrl ? (
                        // Show new image being uploaded
                        <Image 
                          src={previewUrl} 
                          alt="Ad preview" 
                          className="object-cover"
                          width={128}
                          height={128}
                        />
                      ) : adImageUrl ? (
                        // Show existing ad image
                        <Image 
                          src={adImageUrl} 
                          alt="Ad preview" 
                          className="object-cover"
                          width={128}
                          height={128}
                        />
                      ) : (
                        // Show placeholder when no image
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h1 className="text-2xl font-serif">
                        {watchedTitle || "Ad Title"}
                      </h1>
                      <p className="font-semibold">
                        ${watchedPrice || "50"}
                      </p>
                      <p className="text-muted-foreground">
                        {watchedDescription || "Ad Description"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button 
                    className="pointer-events-none" 
                    variant="ghost"
                  >
                    Close
                  </Button>
                  <Link href={watchedButtonUrl} target="_blank" rel="noopener noreferrer">
                    <Button>
                      {watchedButtonText || "Learn more"}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 w-full max-w-2xl">
          <div className="h-9"/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
   );
}
 
export default EditAd;