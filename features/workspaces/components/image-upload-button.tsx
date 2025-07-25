"use client";

import { Button } from "@/components/ui/button";

interface ImageUploadButtonProps {
  hasImage: boolean;
  isPending: boolean;
  onRemoveImage: () => void;
  onUploadClick: () => void;
}

export const ImageUploadButton = ({
  hasImage,
  isPending,
  onRemoveImage,
  onUploadClick,
}: ImageUploadButtonProps) => {
  if (hasImage) {
    return (
      <Button
        className="mt-2 w-fit"
        type="button"
        disabled={isPending}
        variant={"destructive"}
        size="sx"
        onClick={onRemoveImage}>
        Remove Image
      </Button>
    );
  }

  return (
    <Button
      className="mt-2 w-fit"
      type="button"
      disabled={isPending}
      variant={"teritary"}
      size="sx"
      onClick={onUploadClick}>
      Upload Image
    </Button>
  );
};
