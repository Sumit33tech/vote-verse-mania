
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const VoterLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, userRole } = useAuth();

  // Redirect if already logged in as voter
  useEffect(() => {
    if (user && userRole === UserRole.VOTER) {
      navigate("/voter/home");
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await signIn(
        data.email, 
        data.password,
        UserRole.VOTER
      );
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome to Vote Mania!",
      });
      
      // Navigate to voter home
      navigate("/voter/home");
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default VoterLogin;
