
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();

  return (
    <PageContainer className="items-center justify-center text-center">
      <div className="flex flex-col items-center gap-8">
        <Logo size="lg" />
        
        <p className="text-xl text-gray-600 max-w-md">
          An interactive platform for creating and participating in secure voting sessions
        </p>
        
        <div>
          <Button 
            size="lg" 
            className="bg-votePurple hover:bg-votePurple-secondary text-white px-8 py-6 text-lg rounded-lg shadow-lg"
            onClick={() => navigate("/role-select")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Intro;
