import React, { useState, useEffect } from "react";
import axios from "axios";
import Report from "./Report";
import "../styles/UserAccount.css";

const Tabs = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [counts, setCounts] = useState({ total_reports: 0, user_reports: 0 });
    const [allReports, setAllReports] = useState([]);
    const [userReports, setUserReports] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const headers = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Fetch counts via POST (wrapping Data)
        axios
            .get(
                "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/count",
                { headers }
            )
            .then((res) => {
                const data = res.data.Data || {};
                setCounts({
                    total_reports: data.total_reports || 0,
                    user_reports: data.user_reports || 0,
                });
            })
            .catch((err) => console.error("Count error", err));

        // Fetch all reports via POST
        axios
            .get(
                "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report",
                { headers }
            )
            .then((res) => {
                const items = res.data.Data || [];
                setAllReports(Array.isArray(items) ? items : []);
            })
            .catch((err) => console.error("All reports error", err));

        // Fetch user reports via POST
        axios
            .get(
                "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/user-reports",
                { headers }
            )
            .then((res) => {
                const items = res.data.Data || [];
                setUserReports(Array.isArray(items) ? items : []);
            })
            .catch((err) => console.error("User reports error", err));
    }, []);

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
