
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Record<string, string>) => {
    // In a real app, we'd integrate with an authentication service
    console.log("Admin login:", data);
    
    // For demo purposes, always succeed
    toast({
      title: "Login Successful",
      description: "Welcome back to Vote Mania!",
    });
    
    // Navigate to admin home
    navigate("/admin/home");
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
      />
    </PageContainer>
  );
};

export default AdminLogin;
