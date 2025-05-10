import React, { useEffect, useState } from "react";
import notificationApi from "../api/notificationApi";
import { Bell, Check, Trash2, AlertCircle, Clock } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    notificationApi
      .getUserNotifications(localStorage.getItem("userId"))
      .then((notifications) => {
        setNotifications(notifications);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load notifications");
        setLoading(false);
      });
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return <Check className="text-green-500" size={20} />;
      case "message":
        return <Bell className="text-blue-500" size={20} />;
      case "alert":
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex p-4 bg-white rounded-lg shadow"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifications.length > 0 && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {notifications.length}{" "}
            {notifications.length === 1 ? "notification" : "notifications"}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="mx-auto text-gray-400 mb-3" size={32} />
          <h3 className="text-lg font-medium text-gray-500">
            No notifications yet
          </h3>
          <p className="text-gray-400 mt-1">
            When you receive notifications, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 rounded-lg shadow-sm border-l-4 ${
                notification.read
                  ? "bg-white border-gray-200"
                  : "bg-green-50 border-green-500"
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {formatDate(notification.createdAt || new Date())}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
