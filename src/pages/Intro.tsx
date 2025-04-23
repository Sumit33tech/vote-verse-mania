
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/role-select");
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer className="items-center justify-center text-center">
      <div className="flex flex-col items-center gap-8">
        <Logo size="lg" />
        
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-votePurple rounded-full"></div>
          <div className="w-3 h-3 bg-votePurple rounded-full"></div>
          <div className="w-3 h-3 bg-votePurple rounded-full"></div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Intro;
