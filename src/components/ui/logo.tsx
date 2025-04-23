
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl"
  };

  return (
    <h1 className={cn("font-bold", sizeClasses[size], className)}>
      <span className="text-voteRed">Vote</span>
      <span className="text-votePurple">Mania</span>
    </h1>
  );
}
