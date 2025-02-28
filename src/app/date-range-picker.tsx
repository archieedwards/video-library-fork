"use client";

import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type DateRange } from "~/lib/schemas";
import { useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { type DateRange as DatePickerDateRange } from "react-day-picker";
import ClearFilterButton from "~/components/clear-filter-button";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

export function DateRangePicker({
  value: _value,
  onChange,
}: DateRangePickerProps) {
  const value = useMemo(
    () => ({
      from: _value.from ?? undefined,
      to: _value.to ?? undefined,
    }),
    [_value],
  );
  const handleChange = (value?: DatePickerDateRange) => {
    onChange({
      from: value?.from ?? null,
      to: value?.to ?? null,
    });
  };
  return (
    <div className="relative flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              value.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Filter by date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value.from}
            selected={value}
            onSelect={handleChange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
      {(value.from ?? value.to) && (
        <ClearFilterButton
          onClick={() => handleChange({ from: undefined, to: undefined })}
        />
      )}
    </div>
  );
}
