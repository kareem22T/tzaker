import { useState } from "react";

// Mock user data for demonstration
const mockUser = {
  name: "Musharof",
  email: "musharof@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
};

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleSignOut() {
    console.log("Signing out...");
    closeDropdown();
  }

  return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11 border-2 border-[#1e3a52] hover:border-[#00ff88]/50 transition-colors">
            <img src={mockUser.avatar} alt="User" className="w-full h-full object-cover" />
          </span>
          <span className="block mr-1 font-medium text-sm text-white">
            {mockUser.name}
          </span>
          <svg
            className={`stroke-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={closeDropdown}
            ></div>
            <div className="absolute right-0 z-50 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-[#1e3a52] bg-[#111d2d] p-3 shadow-xl">
              <div className="pb-3 border-b border-[#1e3a52]">
                <span className="block font-medium text-white text-sm">
                  {mockUser.name}
                </span>
                <span className="mt-0.5 block text-xs text-gray-400">
                  {mockUser.email}
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={closeDropdown}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 font-medium text-gray-300 rounded-lg group text-sm hover:bg-[#0a1929] hover:text-white transition-colors"
                >
                  Edit profile
                </button>
                <button
                  onClick={closeDropdown}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 font-medium text-gray-300 rounded-lg group text-sm hover:bg-[#0a1929] hover:text-white transition-colors"
                >
                  Change password
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center gap-3 px-3 py-2 mt-1 font-medium text-gray-300 rounded-lg group text-sm hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors border-t border-[#1e3a52] pt-3"
                >
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
  );
}