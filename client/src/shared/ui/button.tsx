import { memo, type ReactNode } from "react";
import { cn } from "./utils";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "default" | "ghost" | "outline";
  title?: string;
  icon?: ReactNode;
}

function Button({
  type = "button",
  className,
  variant = "default",
  title,
  icon,
  ...props
}: ButtonProps) {
  const variantClass = {
    default: "bg-primary text-secondary hover:bg-primary/90",
    ghost: "bg-transparent hover:bg-accent text-foreground",
    outline: "bg-background hover:bg-accent border border-border",
  };

  return (
    <button
      type={type}
      className={cn(
        "flex items-center justify-center py-2 px-2 rounded-md disabled:bg-button-disabled disabled:cursor-not-allowed transition-colors",
        variantClass[variant],
        className
      )}
      {...props}
    >
      {icon && icon}
      {icon && title ? (
        <span className="ml-2">{title}</span>
      ) : (
        title && <span>{title}</span>
      )}
    </button>
  );
}

export default memo(Button);
