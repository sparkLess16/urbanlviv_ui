import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = ({ data = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleNotifications = showAll ? data : data.slice(0, 2);

  return (
    <div className="notification-list visible">
      {data.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <>
          {visibleNotifications.map((notif) => (
            <div key={notif.notification_id} className="notifications-block">
              <div className="one">
                <p className="title">{notif.notification_title}</p>
                <p className="notif-description">
                  {notif.notification_content}
                </p>
              </div>
            </div>
          ))}
          {data.length > 2 && (
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
