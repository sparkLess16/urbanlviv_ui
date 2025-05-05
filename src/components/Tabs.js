import React, { useState, useEffect } from "react";
import axios from "axios";
import Report from "./Report";
import "../styles/UserAccount.css";

const Tabs = ({ shouldRefresh, onRefreshed }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [counts, setCounts] = useState({ total_reports: 0, user_reports: 0 });
  const [allReports, setAllReports] = useState([]);
  const [userReports, setUserReports] = useState([]);

  const fetchAll = async () => {
    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const countRes = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/count",
        { headers }
      );
      const countData = countRes.data.Data || {};
      setCounts({
        total_reports: countData.total_reports || 0,
        user_reports: countData.user_reports || 0,
      });

      const allRes = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report",
        { headers }
      );
      const allItems = allRes.data.Data || [];
      setAllReports(Array.isArray(allItems) ? allItems : []);

      const userRes = await axios.get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/user-reports",
        { headers }
      );
      const userItems = userRes.data.Data || [];
      setUserReports(Array.isArray(userItems) ? userItems : []);
    } catch (err) {
      console.error("Fetching reports failed", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      fetchAll();
      onRefreshed();
    }
  }, [shouldRefresh]);

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All <span className="count">{counts.total_reports}</span>
        </button>

        <button
          className={`tab ${activeTab === "yours" ? "active" : ""}`}
          onClick={() => setActiveTab("yours")}
        >
          Yours <span className="count">{counts.user_reports}</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "all" &&
          allReports.map((r) => <Report key={r.report_id} data={r} />)}

        {activeTab === "yours" &&
          userReports.map((r) => <Report key={r.report_id} data={r} />)}
      </div>
    </div>
  );
};

export default Tabs;
