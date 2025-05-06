import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notificationsData, setNotificationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const { data } = await axios.get(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/user/notifications",
          { headers }
        );

        setNotificationsData(data.Data);
        console.log(data.Data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-list">
      {notificationsData.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notificationsData.map((notif) => (
          <div key={notif.notification_id} className="notifications-block">
            <div className="one">
              <p className="title">
                Report {notif.report_name} has been reviewed!
              </p>
              <p className="description">{notif.notification_content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
