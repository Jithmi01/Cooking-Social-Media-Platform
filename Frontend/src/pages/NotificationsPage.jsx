import React, { useEffect, useState } from "react";
import notificationApi from "../api/notificationApi";
import { Bell, Check, Trash2, AlertCircle, Clock } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

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
