
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  className?: string;
  children: ReactNode;
}

export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={cn("min-h-screen w-full flex flex-col p-4", className)}>
      {children}
    </div>
  );
}
