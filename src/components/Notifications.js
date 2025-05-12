import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notificationsData, setNotificationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

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

        setNotificationsData(data.Data || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const visibleNotifications = showAll
    ? notificationsData
    : notificationsData.slice(0, 2); // show only 2 latest if not expanded

  return (
    <div className={`notification-list ${!loading ? "visible" : ""}`}>
      {loading ? null : error ? (
        <p>Error loading notifications.</p>
      ) : notificationsData.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <>
          {visibleNotifications.map((notif) => (
            <div key={notif.notification_id} className="notifications-block">
              <div className="one">
                <p className="title">{notif.notification_title}</p>
                <p className="description">{notif.notification_content}</p>
              </div>
            </div>
          ))}
          {notificationsData.length > 2 && (
            <button
              className="show-more-btn"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
