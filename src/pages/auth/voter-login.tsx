
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const VoterLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Record<string, string>) => {
    // In a real app, we'd integrate with an authentication service
    console.log("Voter login:", data);
    
    // For demo purposes, always succeed
    toast({
      title: "Login Successful",
      description: "Welcome to Vote Mania!",
    });
    
    // Navigate to voter home
    navigate("/voter/home");
  };

  return (
    <PageContainer className="items-center justify-center">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <Logo size="md" className="mx-auto mb-8" />
        <h2 className="text-2xl font-semibold">Voter Login</h2>
      </div>
      
      <AuthForm 
        type="login" 
        role={UserRole.VOTER} 
        onSubmit={handleSubmit} 
      />
    </PageContainer>
  );
};

export default VoterLogin;
