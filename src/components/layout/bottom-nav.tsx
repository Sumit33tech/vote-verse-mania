
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavItem {
  icon: ReactNode;
  label: string;
  path: string;
}

interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const location = useLocation();
  
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white border-t border-gray-200 p-2",
      className
    )}>
      {items.map((item, index) => {
        const isActive = location.pathname.includes(item.path);
        
        return (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-4 rounded-md transition-colors",
              isActive 
                ? "text-votePurple bg-votePurple/10" 
                : "text-gray-500 hover:text-votePurple hover:bg-votePurple/5"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
