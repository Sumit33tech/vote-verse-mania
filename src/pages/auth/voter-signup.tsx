
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { signUp } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const VoterSignup = () => {
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
      if (!data.aadharNumber) {
        throw new Error("Aadhar Number is required for voter registration");
      }
      
      const { data: authData, error } = await signUp(
        data.email, 
        data.password, 
        {
          name: data.name,
          contact: data.contact,
          role: UserRole.VOTER,
          aadharNumber: data.aadharNumber
        }
      );
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Account Created",
        description: "Your voter account has been created successfully!",
      });
      
      // Navigate to voter login
      navigate("/voter/login");
    } catch (error: any) {
      toast({
        title: "Signup Error",
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
        <h2 className="text-2xl font-semibold">Create Voter Account</h2>
      </div>
      
      <AuthForm 
        type="signup" 
        role={UserRole.VOTER} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default VoterSignup;
