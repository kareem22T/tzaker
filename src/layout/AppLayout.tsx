import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useNavigate, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuth } from "../context/AuthContext";
import React from "react";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // React.useEffect(() => {
  //   // If auth finished loading and there's no token, redirect to sign-in
  //   if (!auth.loading && !auth.token) {
  //     // Avoid redirect loop if already on auth pages
  //     if (!location.pathname.startsWith("/signin") && !location.pathname.startsWith("/signup")) {
  //       navigate("/signin");
  //     }
  //   }
  // }, [auth.loading, auth.token, navigate, location.pathname]);

  if (auth.loading && !auth.token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
