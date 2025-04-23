
import { useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, userRole, isLoading: authLoading } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && userRole === UserRole.ADMIN) {
      navigate("/admin/home");
    }
  }, [user, userRole, navigate, authLoading]);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await signIn(
        data.email, 
        data.password,
        UserRole.ADMIN
      );
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Vote Mania!",
      });
      
      // Navigate to admin home
      navigate("/admin/home", { replace: true });
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <PageContainer className="items-center justify-center">
      <div className="w-full max-w-md mx-auto mb-8 text-center">
        <Logo size="md" className="mx-auto mb-8" />
        <h2 className="text-2xl font-semibold">Admin Login</h2>
      </div>
      
      <AuthForm 
        type="login" 
        role={UserRole.ADMIN} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default AdminLogin;
