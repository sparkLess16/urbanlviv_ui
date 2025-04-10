import "../styles/Report.css";
import photo from "../assets/photo1.png";

const Report = ({ title }) => {
  return (
    <div className="report-card">
      <div className="report-status">🟠 In Review</div>

      <div className="report-header">
        <strong>{title}</strong>
        <span className="report-date">22/09/2024</span>
      </div>

      <p className="report-description">
        Whether it's a pothole, streetlight outage, or any other concern, your
        report will help us improve the city for everyone.
      </p>

      <p className="report-location-title">📍 Where</p>

      <div className="report-images">
        <img src={photo} alt="map1" />
        <img src={photo} alt="map2" />
        <img src={photo} alt="map3" />
      </div>
    </div>
  );
};

export default Report;
