import { cn } from "./utils";

function Button({
  className,
  title,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "w-full py-2 rounded-md bg-primary text-secondary disabled:bg-button-disabled disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {title}
    </button>
  );
}

export default Button;
