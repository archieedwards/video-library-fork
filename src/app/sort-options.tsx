import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface SortOptionsProps<TValue = string> {
  value: TValue;
  onChange: (value: TValue) => void;
}

export function SortOptions<TValue extends string>({
  value,
  onChange,
}: SortOptionsProps<TValue>) {
  return (
    <div className="flex items-center space-x-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="alphabetical">A-Z</SelectItem>
          <SelectItem value="reverse-alphabetical">Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
