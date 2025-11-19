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
        variant="destructive"
        size="sx"
        disabled={isPending}
        onClick={onRemoveImage}
        className="mt-2 w-fit"
        type="button">
        Remove Image
      </Button>
    );
  }

  return (
    <Button
      variant="teritary"
      size="sx"
      disabled={isPending}
      onClick={onUploadClick}
      className="mt-2 w-fit"
      type="button">
      Upload Image
    </Button>
  );
};
