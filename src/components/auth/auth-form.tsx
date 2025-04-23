
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/lib/types";
import { Link } from "react-router-dom";

export type AuthFormProps = {
  type: "login" | "signup";
  role: UserRole;
  onSubmit: (data: Record<string, string>) => void;
};

export function AuthForm({ type, role, onSubmit }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    aadharNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isAdmin = role === UserRole.ADMIN;
  const isSignup = type === "signup";
  const title = `${isSignup ? "Create" : "Login to"} your ${isAdmin ? "Admin" : "Voter"} account`;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleChange}
                required
                placeholder="Enter your contact number"
              />
            </div>
          )}

          {isSignup && !isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                placeholder="Enter your Aadhar number"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={isSignup ? "Create a password" : "Enter your password"}
            />
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-votePurple hover:bg-votePurple-secondary"
          >
            {isSignup ? "Sign Up" : "Login"}
          </Button>
          
          <div className="text-center text-sm">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <Link 
              to={`/${role}/${isSignup ? "login" : "signup"}`} 
              className="text-votePurple hover:text-votePurple-secondary underline"
            >
              {isSignup ? "Login" : "Create new account"}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
