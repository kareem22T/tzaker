import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth.loading && auth.token) {
      navigate('/');
    }
  }, [auth.loading, auth.token, navigate]);

  return (
    <div className="relative p-6 bg-white z-1 darkx:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row darkx:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[#0F0A06] darkx:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 darkx:text-white/60">
                Bring Your Craft to Life with WATCH IT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
