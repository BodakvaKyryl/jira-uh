import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CustomCalendarToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export const CustomCalendarToolbar = ({ date, onNavigate }: CustomCalendarToolbarProps) => {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate("PREV")}
        className="flex items-center">
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="border-input hy-2 text-muted-foreground flex h-8 w-full items-center justify-center rounded-md border px-3 lg:w-auto">
        <CalendarIcon className="mr-2 size-4" />
        <p className="foreground">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onNavigate("NEXT")}
        className="flex items-center">
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};
