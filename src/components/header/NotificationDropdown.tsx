import { useState, useEffect } from "react";
import { Bell, Mail, X } from "lucide-react";

// Mock data for demonstration
const mockNotifications = [
  {
    id: 1,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    subject: "Ticket Inquiry",
    message: "Hello, I'm interested in purchasing tickets for the upcoming match. Could you provide more details?",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Booking Confirmation",
    message: "Thank you for the confirmation. Looking forward to the event!",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 3,
    name: "Mohammed Al-Rashid",
    email: "mohammed.rashid@example.com",
    subject: "Refund Request",
    message: "I would like to request a refund for my recent purchase. Please let me know the process.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    setHasUnreadMessages(notifications.length > 0);
  }, [notifications]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    if (diffInSeconds < 172800) return "1 day ago";
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-400 transition-colors bg-[#111d2d] border border-[#1e3a52] rounded-full hover:text-[#00ff88] h-11 w-11 hover:bg-[#0a1929] hover:border-[#00ff88]/50"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        {hasUnreadMessages && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-[#00ff88]">
            <span className="absolute inline-flex w-full h-full bg-[#00ff88] rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <Bell className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={closeDropdown}
          ></div>
          <div className="absolute right-0 z-50 flex flex-col w-[380px] mt-4 bg-[#111d2d] border border-[#1e3a52] rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#1e3a52]">
              <div>
                <h5 className="text-lg font-semibold text-white">
                  Notifications
                </h5>
                {notifications.length > 0 && (
                  <p className="text-xs text-gray-400">
                    {notifications.length} unread message{notifications.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={toggleDropdown}
                className="text-gray-400 transition hover:text-[#00ff88]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="overflow-y-auto max-h-[480px] divide-y divide-[#1e3a52]">
              {notifications.length === 0 ? (
                <li className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mb-3 bg-[#0a1929] border border-[#1e3a52] rounded-full">
                    <Bell className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-white">No new notifications</p>
                  <p className="mt-1 text-xs text-gray-400">You're all caught up!</p>
                </li>
              ) : (
                notifications.map((notification) => (
                  <li key={notification.id}>
                    <button
                      onClick={closeDropdown}
                      className="flex w-full gap-3 p-4 transition-colors hover:bg-[#0a1929]"
                    >
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                            notification.name
                          )}`}
                        >
                          {getInitials(notification.name)}
                        </div>
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-white bg-[#00ff88]">
                          <Mail className="w-3 h-3" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-medium text-white">
                            {notification.name}
                          </span>{" "}
                          sent you a contact message{" "}
                          <span className="font-medium text-white">
                            {notification.subject}
                          </span>
                        </p>
                        <p className="mb-2 text-xs text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{notification.email}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span>{getTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#1e3a52]">
                <button
                  onClick={closeDropdown}
                  className="w-full px-4 py-2 text-sm font-medium text-white transition-colors bg-[#0a1929] border border-[#1e3a52] rounded-lg hover:bg-[#111d2d] hover:border-[#00ff88]/50"
                >
                  View All Messages
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}