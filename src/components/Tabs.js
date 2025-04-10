import { useState } from "react";
import "../styles/UserAccount.css";
import Report from "./Report";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All <span className="count">34</span>
        </button>

        <button
          className={`tab ${activeTab === "yours" ? "active" : ""}`}
          onClick={() => setActiveTab("yours")}
        >
          Yours <span className="count">4</span>
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "all" &&
          Array.from({ length: 5 }, (_, index) => (
            <Report key={index} title={`Report ${index + 1}`} />
          ))}

        {activeTab === "yours" && (
          <p>
            This is the content for <strong>Yours</strong>.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
