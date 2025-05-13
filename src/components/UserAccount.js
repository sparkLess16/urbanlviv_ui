import React from "react";
import { useState, useEffect } from "react";
import myImage from "../assets/useraccount.png";
import "../styles/UserAccount.css";
import Tabs from "./Tabs";
import ReportForm from "./ReportForm";
import EditForm from "./EditForm";
import Notifications from "./Notifications";
import axios from "axios";

const UserAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [notificationsData, setNotificationsData] = useState([]);
  const [isUserViewingNotif, setIsUserViewingNotif] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const openNotif = () => {
    setIsUserViewingNotif(true);
    setIsOpenNotif(true);
    markAllNotificationsAsViewed();
  };

  const closeNotif = () => {
    setIsUserViewingNotif(false);
    setIsOpenNotif(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUnread();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [isUserViewingNotif]);

  const [shouldRefreshReports, setShouldRefreshReports] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userData = user.data || {};
  const firstName = userData.first_name || "";
  const lastName = userData.last_name || "";

  const formattedName = `${firstName} ${lastName}`.toUpperCase();

  const handleReportSubmitted = async () => {
    setShouldRefreshReports(true);
    // Зачекай трохи — серверу може бути потрібно кілька мс
    tryUpdateNotifications();
  };

  const fetchUnread = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const resp = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/user/notifications/not-viewed",
        { headers }
      );

      const unreadCount =
        typeof resp.data.Data === "number" ? resp.data.Data : 0;
      setUnreadNotifs(unreadCount);
      console.log(
        "🔄 Unread count:",
        unreadCount,
        "⏰",
        new Date().toLocaleTimeString()
      );
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
      setUnreadNotifs(0);
    }
  };

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const resp = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/user/notifications",
        { headers }
      );

      return resp.data.Data || [];
    } catch (err) {
      console.error("Error fetching all notifications:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const allNotifications = await fetchAll();
      setNotificationsData(allNotifications);
    };
    loadData();
  }, []);

  const tryUpdateNotifications = async (attempt = 0) => {
    if (attempt >= 5) return;

    const prevCount = unreadNotifs;
    await fetchUnread();

    if (unreadNotifs !== prevCount) {
      const all = await fetchAll();
      setNotificationsData(all);
    } else {
      setTimeout(() => tryUpdateNotifications(attempt + 1), 8000);
    }
  };

  const markAllNotificationsAsViewed = async () => {
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

      const notifs = (data.Data || []).filter((n) => !n.is_read);
      console.log("notifs:", notifs);

      const markRequests = notifs.map((notif) =>
        axios.get(
          `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/user/notifications/${notif.notification_id}/update-to-viewed`,
          { headers }
        )
      );

      await Promise.all(markRequests);

      setTimeout(() => {
        fetchUnread();
      }, 1000);
    } catch (err) {
      console.error("Error marking notifications as viewed:", err);
    }
  };

  return (
    <div className="userAccount">
      <img src={myImage} alt="Description" className="top-pic" />
      <div className="container-useraccount">
        <div className="right-side">
          <div className="headline">
            <h2 className="name">Welcome Back, {formattedName}!</h2>
            <div className="icons">
              <button
                className="open-modal-btn"
                id="openModal"
                onClick={openModal}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="36" height="36" rx="7" fill="white" />
                  <path
                    d="M18.1596 17.62C18.1296 17.62 18.1096 17.62 18.0796 17.62C18.0296 17.61 17.9596 17.61 17.8996 17.62C14.9996 17.53 12.8096 15.25 12.8096 12.44C12.8096 9.58 15.1396 7.25 17.9996 7.25C20.8596 7.25 23.1896 9.58 23.1896 12.44C23.1796 15.25 20.9796 17.53 18.1896 17.62C18.1796 17.62 18.1696 17.62 18.1596 17.62ZM17.9996 8.75C15.9696 8.75 14.3096 10.41 14.3096 12.44C14.3096 14.44 15.8696 16.05 17.8596 16.12C17.9096 16.11 18.0496 16.11 18.1796 16.12C20.1396 16.03 21.6796 14.42 21.6896 12.44C21.6896 10.41 20.0296 8.75 17.9996 8.75Z"
                    fill="#292D32"
                  />
                  <path
                    d="M18.1696 28.55C16.2096 28.55 14.2396 28.05 12.7496 27.05C11.3596 26.13 10.5996 24.87 10.5996 23.5C10.5996 22.13 11.3596 20.86 12.7496 19.93C15.7496 17.94 20.6096 17.94 23.5896 19.93C24.9696 20.85 25.7396 22.11 25.7396 23.48C25.7396 24.85 24.9796 26.12 23.5896 27.05C22.0896 28.05 20.1296 28.55 18.1696 28.55ZM13.5796 21.19C12.6196 21.83 12.0996 22.65 12.0996 23.51C12.0996 24.36 12.6296 25.18 13.5796 25.81C16.0696 27.48 20.2696 27.48 22.7596 25.81C23.7196 25.17 24.2396 24.35 24.2396 23.49C24.2396 22.64 23.7096 21.82 22.7596 21.19C20.2696 19.53 16.0696 19.53 13.5796 21.19Z"
                    fill="#292D32"
                  />
                </svg>
              </button>

              {/* Modal */}
              {isOpen && (
                <div className="modal" onClick={closeModal}>
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 36 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="36" height="36" rx="7" fill="white" />
                        <path
                          d="M18.1596 17.62C18.1296 17.62 18.1096 17.62 18.0796 17.62C18.0296 17.61 17.9596 17.61 17.8996 17.62C14.9996 17.53 12.8096 15.25 12.8096 12.44C12.8096 9.58 15.1396 7.25 17.9996 7.25C20.8596 7.25 23.1896 9.58 23.1896 12.44C23.1796 15.25 20.9796 17.53 18.1896 17.62C18.1796 17.62 18.1696 17.62 18.1596 17.62ZM17.9996 8.75C15.9696 8.75 14.3096 10.41 14.3096 12.44C14.3096 14.44 15.8696 16.05 17.8596 16.12C17.9096 16.11 18.0496 16.11 18.1796 16.12C20.1396 16.03 21.6796 14.42 21.6896 12.44C21.6896 10.41 20.0296 8.75 17.9996 8.75Z"
                          fill="#292D32"
                        />
                        <path
                          d="M18.1696 28.55C16.2096 28.55 14.2396 28.05 12.7496 27.05C11.3596 26.13 10.5996 24.87 10.5996 23.5C10.5996 22.13 11.3596 20.86 12.7496 19.93C15.7496 17.94 20.6096 17.94 23.5896 19.93C24.9696 20.85 25.7396 22.11 25.7396 23.48C25.7396 24.85 24.9796 26.12 23.5896 27.05C22.0896 28.05 20.1296 28.55 18.1696 28.55ZM13.5796 21.19C12.6196 21.83 12.0996 22.65 12.0996 23.51C12.0996 24.36 12.6296 25.18 13.5796 25.81C16.0696 27.48 20.2696 27.48 22.7596 25.81C23.7196 25.17 24.2396 24.35 24.2396 23.49C24.2396 22.64 23.7096 21.82 22.7596 21.19C20.2696 19.53 16.0696 19.53 13.5796 21.19Z"
                          fill="#292D32"
                        />
                      </svg>
                      Edit User Information
                    </h2>
                    <button className="close-btn" onClick={closeModal}>
                      &times;
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="24" rx="5.25" fill="#292D32" />
                        <path
                          d="M6 6L12 12M18 18L12 12M12 12L18 6M12 12L6 18"
                          stroke="white"
                          stroke-width="1.5"
                        />
                      </svg>
                    </button>
                    <EditForm
                      onClose={closeModal}
                      onUpdate={() => window.location.reload()}
                    />
                  </div>
                </div>
              )}

              <div className="notif-wrapper">
                <button
                  class="open-modal-btn"
                  id="openNotif"
                  onClick={openNotif}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="36" height="36" rx="7" fill="white" />
                    <path
                      d="M18.0201 26.53C15.6901 26.53 13.3601 26.16 11.1501 25.42C10.3101 25.13 9.67011 24.54 9.39011 23.77C9.10011 23 9.20011 22.15 9.66011 21.39L10.8101 19.48C11.0501 19.08 11.2701 18.28 11.2701 17.81V14.92C11.2701 11.2 14.3001 8.17004 18.0201 8.17004C21.7401 8.17004 24.7701 11.2 24.7701 14.92V17.81C24.7701 18.27 24.9901 19.08 25.2301 19.49L26.3701 21.39C26.8001 22.11 26.8801 22.98 26.5901 23.77C26.3001 24.56 25.6701 25.16 24.8801 25.42C22.6801 26.16 20.3501 26.53 18.0201 26.53ZM18.0201 9.67004C15.1301 9.67004 12.7701 12.02 12.7701 14.92V17.81C12.7701 18.54 12.4701 19.62 12.1001 20.25L10.9501 22.16C10.7301 22.53 10.6701 22.92 10.8001 23.25C10.9201 23.59 11.2201 23.85 11.6301 23.99C15.8101 25.39 20.2401 25.39 24.4201 23.99C24.7801 23.87 25.0601 23.6 25.1901 23.24C25.3201 22.88 25.2901 22.49 25.0901 22.16L23.9401 20.25C23.5601 19.6 23.2701 18.53 23.2701 17.8V14.92C23.2701 12.02 20.9201 9.67004 18.0201 9.67004Z"
                      fill="#292D32"
                    />
                    <path
                      d="M19.8801 9.94005C19.8101 9.94005 19.7401 9.93005 19.6701 9.91005C19.3801 9.83005 19.1001 9.77005 18.8301 9.73005C17.9801 9.62005 17.1601 9.68005 16.3901 9.91005C16.1101 10.0001 15.8101 9.91005 15.6201 9.70005C15.4301 9.49005 15.3701 9.19005 15.4801 8.92005C15.8901 7.87005 16.8901 7.18005 18.0301 7.18005C19.1701 7.18005 20.1701 7.86005 20.5801 8.92005C20.6801 9.19005 20.6301 9.49005 20.4401 9.70005C20.2901 9.86005 20.0801 9.94005 19.8801 9.94005Z"
                      fill="#292D32"
                    />
                    <path
                      d="M18.02 28.8101C17.03 28.8101 16.07 28.4101 15.37 27.7101C14.67 27.0101 14.27 26.0501 14.27 25.0601H15.77C15.77 25.6501 16.01 26.2301 16.43 26.6501C16.85 27.0701 17.43 27.3101 18.02 27.3101C19.26 27.3101 20.27 26.3001 20.27 25.0601H21.77C21.77 27.1301 20.09 28.8101 18.02 28.8101Z"
                      fill="#292D32"
                    />
                  </svg>
                </button>
                {unreadNotifs > 0 && (
                  <span className="notif-count">{unreadNotifs}</span>
                )}
              </div>

              {isOpenNotif && (
                <div className="modal-overlay" onClick={closeNotif}>
                  <div
                    className="modal-content-notif"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4 className="notificationBox">Notificaton Box</h4>
                    <div className="notif-scrollable">
                      <Notifications data={notificationsData} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <p>
            Here, you can easily report any issues you encounter around the
            city.
          </p>
          <p className="text-unimport">
            Whether it's a pothole, streetlight outage, or any other concern,
            your report will help us improve the city for everyone.
          </p>
          <Tabs
            shouldRefresh={shouldRefreshReports}
            onRefreshed={() => setShouldRefreshReports(false)}
          />
        </div>
        <div className="left-side">
          <ReportForm onSubmitted={handleReportSubmitted} />
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
