
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Mock admin data
const adminData = {
  name: "John Admin",
  email: "admin@votemania.com",
  contact: "+91 9876543210",
};

const AdminAccount = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(adminData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we'd update this in the database
    console.log("Updated admin data:", userData);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("selectedRole");
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    
    navigate("/");
  };

  return (
    <AdminLayout title="Account">
      <Card className="mb-6">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={userData.name}
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
                value={userData.email}
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
                value={userData.contact}
                onChange={handleChange}
                disabled={!isEditing}
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
                    setUserData(adminData);
                    setIsEditing(false);
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
    </AdminLayout>
  );
};

export default AdminAccount;
