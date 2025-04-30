import React from "react";
import { useState } from "react";
import myImage from "../assets/useraccount.png";
import "../styles/UserAccount.css";
import Tabs from "./Tabs";
import ReportForm from "./ReportForm";
import EditForm from "./EditForm";

const UserAccount = () => {
  return (
    <div className="userAccount">
      <img src={myImage} alt="Description" className="top-pic" />
      <div className="container-useraccount">
        <div className="right-side">
          <h2>Welcome Back, GERUS ANDREANA!</h2>
          <p>
            Here, you can easily report any issues you encounter around the
            city.
          </p>
          <p className="text-unimport">
            Whether it's a pothole, streetlight outage, or any other concern,
            your report will help us improve the city for everyone.
          </p>
          <Tabs />
        </div>
        <div className="left-side">
          <ReportForm />
          <EditForm />
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
