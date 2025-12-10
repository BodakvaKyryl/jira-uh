"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface datePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DatePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
}: datePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn(
            "w-full justify-start truncate px-3 text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}>
          <CalendarIcon className="mr-2 size-4" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span className={"text-muted-foreground truncate"}>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={value ?? undefined}
          onSelect={(date) => onChange(date as Date)}
        />
      </PopoverContent>
    </Popover>
  );
};
