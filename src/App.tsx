
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

// Main pages
import Intro from "./pages/Intro";
import RoleSelect from "./pages/RoleSelect";

// Auth pages
import AdminLogin from "./pages/auth/admin-login";
import AdminSignup from "./pages/auth/admin-signup";
import VoterLogin from "./pages/auth/voter-login";
import VoterSignup from "./pages/auth/voter-signup";

// Admin pages
import AdminHome from "./pages/admin/admin-home";
import AdminSchedule from "./pages/admin/admin-schedule";
import AdminAccount from "./pages/admin/admin-account";
import AdminHistory from "./pages/admin/admin-history";

// Voter pages
import VoterHome from "./pages/voter/voter-home";
import VoterVote from "./pages/voter/voter-vote";
import VoterAccount from "./pages/voter/voter-account";
import VoterHistory from "./pages/voter/voter-history";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Intro />} />
            <Route path="/role-select" element={<RoleSelect />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/schedule" element={<AdminSchedule />} />
            <Route path="/admin/schedule/:id" element={<AdminSchedule />} />
            <Route path="/admin/account" element={<AdminAccount />} />
            <Route path="/admin/history" element={<AdminHistory />} />
            
            {/* Voter routes */}
            <Route path="/voter/login" element={<VoterLogin />} />
            <Route path="/voter/signup" element={<VoterSignup />} />
            <Route path="/voter/home" element={<VoterHome />} />
            <Route path="/voter/vote/:code" element={<VoterVote />} />
            <Route path="/voter/account" element={<VoterAccount />} />
            <Route path="/voter/history" element={<VoterHistory />} />
            
            {/* Redirects */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/voter" element={<Navigate to="/voter/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
