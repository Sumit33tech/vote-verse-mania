
import { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { BottomNav, NavItem } from "@/components/layout/bottom-nav";
import { Home, History, User } from "lucide-react";

interface VoterLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems: NavItem[] = [
  {
    icon: <Home size={20} />,
    label: "Home",
    path: "/voter/home",
  },
  {
    icon: <History size={20} />,
    label: "History",
    path: "/voter/history",
  },
  {
    icon: <User size={20} />,
    label: "Account",
    path: "/voter/account",
  },
];

export function VoterLayout({ children, title }: VoterLayoutProps) {
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
