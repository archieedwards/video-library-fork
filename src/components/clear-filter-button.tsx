import { X } from "lucide-react";
import { type ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = Omit<ComponentProps<typeof Button>, "children" | "type">;

export default function ClearFilterButton({ className, ...props }: Props) {
  return (
    <Button
      className={cn("absolute right-2 h-5 p-2", className)}
      type="button"
      variant="ghost"
      size="sm"
      {...props}
    >
      <X className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
