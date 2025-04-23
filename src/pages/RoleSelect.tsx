
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { PageContainer } from "@/components/layout/page-container";
import { UserRole } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { User, UserCog } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { user, userRole, isLoading } = useAuth();

  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (!isLoading) {
      if (user && userRole === UserRole.ADMIN) {
        navigate("/admin/home");
        return;
      } else if (user && userRole === UserRole.VOTER) {
        navigate("/voter/home");
        return;
      }
    }
  }, [user, userRole, isLoading, navigate]);
  
  const handleRoleSelect = (role: UserRole) => {
    // Clean any previous auth state to ensure fresh login
    signOut().then(() => {
      localStorage.setItem("selectedRole", role);
      navigate(`/${role}/login`);
    });
  };

  if (isLoading) {
    return (
      <PageContainer className="items-center justify-center">
        <p>Loading...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="items-center justify-center text-center">
      <div className="flex flex-col items-center gap-8">
        <Logo size="md" />
        
        <h2 className="text-2xl font-semibold mb-8">Select Your Role</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div>
            <Button 
              variant="outline"
              size="lg" 
              className="flex flex-col items-center gap-3 h-auto px-12 py-8 border-2 border-votePurple hover:bg-votePurple/5"
              onClick={() => handleRoleSelect(UserRole.ADMIN)}
            >
              <UserCog size={36} className="text-votePurple" />
              <span className="text-xl font-medium">Admin</span>
              <span className="text-sm text-gray-500 font-normal">Create & manage votings</span>
            </Button>
          </div>
          
          <div>
            <Button 
              variant="outline"
              size="lg" 
              className="flex flex-col items-center gap-3 h-auto px-12 py-8 border-2 border-voteRed hover:bg-voteRed/5"
              onClick={() => handleRoleSelect(UserRole.VOTER)}
            >
              <User size={36} className="text-voteRed" />
              <span className="text-xl font-medium">Voter</span>
              <span className="text-sm text-gray-500 font-normal">Participate in votings</span>
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default RoleSelect;
