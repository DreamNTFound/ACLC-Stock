import { useEffect, useState } from "react";
import socket from "@/socket";

export const NotificationBell = ({ profileId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchNotifications = async () => {
    if (!profileId) return;

    try {
      const response = await fetch(`${API_URL}/notifications/${profileId}`);
      //console.log("Fetch notifications response:", response);

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      //console.log("All Notification from backend:", data);

      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      // data.forEach((notification, index) => {
      //   console.log(`🔔 Notification #${index + 1}:`, {
      //     id: notification._id,
      //     title: notification.title,
      //     message: notification.message,
      //     isRead: notification.isRead,
      //     read: notification.read,
      //     created_at: notification.created_at,
      //   });
      // });

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (!profileId) return;
    //console.log("🔍 NotificationBell profileId:", profileId);
    fetchNotifications();
  }, [profileId]);

  useEffect(() => {
    const handleNewNotification = (data) => {
      console.log("New notification received:", data);

      const newNotification = {
        _id: `socket-${data.reservationId}-${Date.now()}`,
        title: "Reservation Ready",
        message: data.message,
        isRead: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    };

    socket.on("reservation ready", handleNewNotification);

    return () => {
      socket.off("reservation ready", handleNewNotification);
    };
  });

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  // Function to mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PUT",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      const updatedNotification = await response.json();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: updatedNotification.isRead }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId,
        ),
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full
                   text-white transition hover:bg-gray-100 hover:text-gray-900"
      >
        {/* Bell Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0
               A2.25 2.25 0 0 1 7.5 14.868V11a4.5 4.5 0 0 1
               9 0v3.868a2.25 2.25 0 0 1-1.643 2.214ZM9.75
               20.25h4.5"
          />
        </svg>

        {/* Unread Badge */}
        {unreadNotificationCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5
                       items-center justify-center rounded-full bg-red-500
                       px-1 text-[10px] font-bold text-white ring-2 ring-white"
          >
            {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-3 w-80 overflow-hidden
                     rounded-xl border border-gray-200 bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>

            {unreadNotificationCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadNotificationCount} unread
              </span>
            )}
          </div>

          {/* Notifications */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="mb-2 text-3xl">🔔</div>

                <p className="text-sm font-medium text-gray-700">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex gap-3 border-b px-4 py-4 transition hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50/60" : "bg-white"
                  }`}
                >
                  {/* Notification icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-full ${
                                  !notification.isRead
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0
                           A2.25 2.25 0 0 1 7.5 14.868V11a4.5 4.5 0 0 1
                           9 0v3.868a2.25 2.25 0 0 1-1.643 2.214ZM9.75
                           20.25h4.5"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          !notification.isRead
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[11px] text-gray-400">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markNotificationAsRead(notification._id)
                          }
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteNotification(notification._id)}
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
