"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { ImageUploadButton } from "@/components/image-upload-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FormItem } from "@/components/ui/form";

interface ImageUploadFieldProps {
  label: string;
  placeholder: string;
  value?: File | string;
  onChange: (value: File | undefined) => void;
  isPending?: boolean;
}

export const ImageUploadField = ({
  label,
  placeholder,
  value,
  onChange,
  isPending = false,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  return (
    <FormItem>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-5">
          {value ? (
            <div className="relative size-[72px] overflow-hidden rounded-md">
              <Image
                src={value instanceof File ? URL.createObjectURL(value) : value}
                alt={label.toLowerCase()}
                className="object-cover"
                fill
              />
            </div>
          ) : (
            <Avatar className="size-[72px]">
              <AvatarFallback>
                <ImageIcon className="size-[36px] text-neutral-400" />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            <p className="text-sm">{label}</p>
            <p className="text-muted-foreground text-xs">{placeholder}</p>
            <ImageUploadButton
              hasImage={!!value}
              isPending={isPending}
              onRemoveImage={handleRemoveImage}
              onUploadClick={handleUploadClick}
            />
          </div>
        </div>
        <input
          className="hidden"
          type="file"
          accept=".jpg, .png, .svg, .jpeg"
          ref={inputRef}
          disabled={isPending}
          onChange={handleImageChange}
        />
      </div>
    </FormItem>
  );
};
