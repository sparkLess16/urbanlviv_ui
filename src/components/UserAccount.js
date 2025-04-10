import React from "react";
import { useState } from "react";
import myImage from "../assets/useraccount.png";
import "../styles/UserAccount.css";
import Tabs from "./Tabs";
import MapComponent from "./MapComponent";

const UserAccount = () => {
  return (
    <div className="userAccount">
      <img src={myImage} alt="Description" className="top-pic" />
      <div className="container-useraccount">
        <div className="right-side">
          <h2>Welcome Back, [Name]!</h2>
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
          <div id="map" style={{ height: "400px", width: "100%" }}>
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
