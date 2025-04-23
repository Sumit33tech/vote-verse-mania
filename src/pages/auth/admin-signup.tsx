
import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { signUp } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, userRole } = useAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && userRole === UserRole.ADMIN) {
      navigate("/admin/home");
    }
  }, [user, userRole, navigate]);

  const handleSubmit = async (data: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      const { data: authData, error } = await signUp(
        data.email, 
        data.password, 
        {
          name: data.name,
          contact: data.contact,
          role: UserRole.ADMIN
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
        description: "Your admin account has been created successfully!",
      });
      
      // Navigate to admin login
      navigate("/admin/login");
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
        <h2 className="text-2xl font-semibold">Create Admin Account</h2>
      </div>
      
      <AuthForm 
        type="signup" 
        role={UserRole.ADMIN} 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default AdminSignup;
