
import { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { BottomNav, NavItem } from "@/components/layout/bottom-nav";
import { Home, PlusCircle, History, User } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems: NavItem[] = [
  {
    icon: <Home size={20} />,
    label: "Home",
    path: "/admin/home",
  },
  {
    icon: <PlusCircle size={20} />,
    label: "Add Voting",
    path: "/admin/schedule",
  },
  {
    icon: <History size={20} />,
    label: "History",
    path: "/admin/history",
  },
  {
    icon: <User size={20} />,
    label: "Account",
    path: "/admin/account",
  },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <PageContainer className="pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <BottomNav items={navItems} />
    </PageContainer>
  );
}
