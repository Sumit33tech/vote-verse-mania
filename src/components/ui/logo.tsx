import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "mobile";
}

export function Logo({ className, size = "md", variant = "default" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl"
  };

  // Mobile variant with white background and specific logo styling
  if (variant === "mobile") {
    return (
      <div className={cn(
        "flex items-center justify-center", 
        "bg-white p-4 rounded-lg shadow-md",
        className
      )}>
        <h1 className={cn("font-bold flex", sizeClasses[size])}>
          <span className="text-voteRed mr-1">V</span>
          <span className="text-votePurple">M</span>
        </h1>
      </div>
    );
  }

  // Default variant remains the same
  return (
    <h1 className={cn("font-bold", sizeClasses[size], className)}>
      <span className="text-voteRed">Vote</span>
      <span className="text-votePurple">Mania</span>
    </h1>
  );
}
