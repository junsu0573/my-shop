import { memo } from "react";
import { cn } from "./utils";

function Input({
  className,
  type,
  placeholder,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full p-2 rounded-md bg-white border border-border focus:outline-none focus:ring-2 focus:ring-ring transition duration-300",
        className
      )}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
}

export default memo(Input);
