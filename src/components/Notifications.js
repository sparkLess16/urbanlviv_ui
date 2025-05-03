import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

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

                setNotifications(data.Data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);


    // дороби, виводи те що потрібно
  return (
    <div className="notifications-block">
      <div className="one">
        <p className="title">Title</p>
        <p className="description">
          Here, you can easily report any issues you encounter around the city.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
