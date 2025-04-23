
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "./types";
import { toast } from "@/components/ui/use-toast";

export const signUp = async (
  email: string, 
  password: string, 
  userData: { 
    name: string, 
    contact?: string, 
    role: UserRole,
    aadharNumber?: string 
  }
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          contact: userData.contact || "",
          role: userData.role,
          aadharNumber: userData.aadharNumber || ""
        }
      }
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { data: null, error: error.message || "Failed to sign up" };
  }
};

export const signIn = async (email: string, password: string, expectedRole: UserRole) => {
  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      throw signInError;
    }

    // Fetch the user's profile to check the role
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Check if the user has the expected role
    if (profileData.role !== expectedRole) {
      await supabase.auth.signOut();
      throw new Error(`Access denied. This account is not registered as a ${expectedRole}.`);
    }

    return { data: signInData, error: null };
  } catch (error: any) {
    console.error("Login error:", error);
    return { data: null, error: error.message || "Failed to sign in" };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { error: null };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { error: error.message || "Failed to sign out" };
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return { session, error: null };
  } catch (error: any) {
    console.error("Get session error:", error);
    return { session: null, error: error.message || "Failed to get session" };
  }
};

export const getCurrentUserRole = async (): Promise<UserRole | null> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    if (error || !data) {
      return null;
    }
    
    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};
