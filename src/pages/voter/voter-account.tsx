
import { VoterLayout } from "@/components/layout/voter-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { getUserProfile, signOut } from "@/lib/auth";
import { Profile } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";

const VoterAccount = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Protect this route
  useRequireAuth(UserRole.VOTER);

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      const profile = await getUserProfile();
      if (profile) {
        setUserData(profile);
      } else {
        toast({
          title: "Failed to load profile",
          description: "Please try logging in again",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          email: userData.email,
          contact: userData.contact
        })
        .eq('id', userData.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Logout Failed",
        description: error,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    
    navigate("/");
  };

  if (isLoading) {
    return (
      <VoterLayout title="My Account">
        <div className="flex items-center justify-center py-10">
          <p>Loading account information...</p>
        </div>
      </VoterLayout>
    );
  }

  if (!userData) {
    return (
      <VoterLayout title="My Account">
        <div className="flex items-center justify-center py-10">
          <p>Unable to load account. Please try logging in again.</p>
        </div>
      </VoterLayout>
    );
  }

  return (
    <VoterLayout title="My Account">
      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={userData.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                value={userData.contact || ''}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                name="aadhar_number"
                value={userData.aadhar_number || ''}
                onChange={handleChange}
                disabled={true} // Aadhar number should not be editable for security
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
            {isEditing ? (
              <>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    getUserProfile().then(profile => {
                      if (profile) setUserData(profile);
                      setIsEditing(false);
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-votePurple hover:bg-votePurple-secondary"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-2">Account Actions</h3>
          <p className="text-gray-500 text-sm">
            Logout from your account or manage account settings
          </p>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </CardFooter>
      </Card>
    </VoterLayout>
  );
};

export default VoterAccount;
