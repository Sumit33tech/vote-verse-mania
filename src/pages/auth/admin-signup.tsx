
import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const AdminSignup = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: Record<string, string>) => {
    // In a real app, we'd integrate with an authentication service
    console.log("Admin signup:", data);
    
    // For demo purposes, always succeed
    toast({
      title: "Account Created",
      description: "Your admin account has been created successfully!",
    });
    
    // Navigate to admin login
    navigate("/admin/login");
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
      />
    </PageContainer>
  );
};

export default AdminSignup;
