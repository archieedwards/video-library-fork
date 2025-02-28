import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  defaultValue: string;
  onChange: (value: string) => void;
}

export function SearchBar({ defaultValue, onChange }: SearchBarProps) {
  const handleInputChange = useDebouncedCallback(onChange, 500);
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search videos..."
        defaultValue={defaultValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
