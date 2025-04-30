import React from "react";
import "../styles/Report.css";

const Report = ({ data }) => {
    const {
        status_name,
        title,
        created_dt,
        description,
        location,
        attachment_url,
    } = data;

    // format date
    const formattedDate = new Date(created_dt).toLocaleDateString();
    // ensure attachments array
    const attachments = Array.isArray(attachment_url)
        ? attachment_url
        : attachment_url
            ? [attachment_url]
            : [];

    return (
        <div className="report-card">
            <div className="report-status">{status_name}</div>

            <div className="report-header">
                <strong>{title}</strong>
                <span className="report-date">{formattedDate}</span>
            </div>

            <p className="report-description">{description}</p>

            <p className="report-location-title">📍 Where</p>
            <p className="report-location">{location}</p>

            {attachments.length > 0 && (
                <div className="report-images">
                    {attachments.map((src, i) => (
                        <img key={i} src={src} alt={`attachment-${i}`} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Report;