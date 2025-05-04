import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ReportView.css";
import EditModal from "./EditModal";

const ReportView = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [userReaction, setUserReaction] = useState(null)
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const isReportCreator = reportData?.createdBy === id;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/userAccount");
  };

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const res = await axios.get(
          `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${id}/details`,
          { headers }
      );
      const raw = res.data.Data ?? res.data.data;
      const rpt = Array.isArray(raw) ? raw[0] : raw ?? {};

      setUserReaction(
          rpt.is_user_liked    ? "like"    :
              rpt.is_user_disliked ? "dislike" :
                  null
      );
      setLikes(rpt.total_likes    || 0);
      setDislikes(rpt.total_dislikes || 0);

      setReportData(rpt);
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!reportData) return;
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const reportId = (reportData.reportId || reportData.report_id).toString();

        const res = await axios.get(
            `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${reportId}/comments`,
            { headers }
        );

        const comms = (res.data.Data || []).map(c => ({
          created_by:      c.created_by,
          comment_content: c.comment_content,
          created_dt:      c.created_dt
        }));

        setComments(comms);
      } catch (err) {
        console.error("Помилка при завантаженні коментарів:", err);
      }
    };
    fetchComments();
  }, [reportData]);

  const handleLike = async () => {
    const reportId = (reportData?.reportId || reportData?.report_id)?.toString();
    if (!reportId) return;

    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
        { ReportId: reportId, ReactionId: "1" },
        { headers }
    );

    if (userReaction === "like") {
      setLikes(prev => prev - 1);
      setUserReaction(null);
    } else {
      if (userReaction === "dislike") setDislikes(prev => prev - 1);
      setLikes(prev => prev + 1);
      setUserReaction("like");
    }
  };

  const handleDislike = async () => {
    const reportId = (reportData?.reportId || reportData?.report_id)?.toString();
    if (!reportId) return;

    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
        { ReportId: reportId, ReactionId: "2" },
        { headers }
    );

    if (userReaction === "dislike") {
      setDislikes(prev => prev - 1);
      setUserReaction(null);
    } else {
      if (userReaction === "like") setLikes(prev => prev - 1);
      setDislikes(prev => prev + 1);
      setUserReaction("dislike");
    }
  };



  if (!reportData) return <div>Loading...</div>;

  const {
    status_name,
    title,
    created_dt,
    description,
    location,
    attachment_url,
  } = reportData;

  const formattedDate = new Date(created_dt).toLocaleDateString();
  const attachments = Array.isArray(attachment_url)
    ? attachment_url
    : attachment_url
      ? [attachment_url]
      : [];

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    const reportId = (reportData?.reportId || reportData?.report_id)?.toString();
    if (!reportId) return console.error("No reportId");

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-comment",
          { ReportId: reportId, CommentContext: commentInput },
          { headers }
      );

      const me = JSON.parse(localStorage.getItem("user") || "{}");
      const newC = {
        created_by:      me.name || "Anonymous",
        comment_content: commentInput,
        created_dt:      new Date().toISOString()
      };
      setComments(prev => [...prev, newC]);
      setCommentInput("");
    } catch (err) {
      console.error("Помилка при додаванні коментаря:", err);
    }
  };

  return (
    <div className="report-view-container">
      <div className="view-actions">
        <button className="return-btn" onClick={handleReturn}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="7" fill="black" />
            <path
              d="M21 26.67C20.81 26.67 20.62 26.6 20.47 26.45L13.95 19.93C12.89 18.87 12.89 17.13 13.95 16.07L20.47 9.55002C20.76 9.26002 21.24 9.26002 21.53 9.55002C21.82 9.84002 21.82 10.32 21.53 10.61L15.01 17.13C14.53 17.61 14.53 18.39 15.01 18.87L21.53 25.39C21.82 25.68 21.82 26.16 21.53 26.45C21.38 26.59 21.19 26.67 21 26.67Z"
              fill="white"
            />
          </svg>
        </button>
        {isReportCreator && (
          <button className="edit-btn" onClick={() => setIsEditModalOpen(true)}>
            Edit
          </button>
        )}
      </div>
      <div className="view-container">
        {attachments.length > 0 && (
            <div className="report-images">
              {attachments.map((src, i) => (
                  <img key={i} src={src} alt={`attachment-${i}`}/>
              ))}
            </div>
        )}
        <div className="report-header">
          <strong>{title}</strong>
          <span className="report-date">{formattedDate}</span>
        </div>
        <div className="report-status">{status_name}</div>

        <p className="report-description">{description}</p>

        <p className="report-location-title">📍 Where</p>
        <p className="report-location">{location}</p>

        <div className="reaction-buttons">
          <button
              className={`reaction-btn ${userReaction === "like" ? "active" : ""}`}
              onClick={handleLike}
          >
            ❤️ {likes}
          </button>
          <button
              className={`reaction-btn ${userReaction === "dislike" ? "active" : ""}`}
              onClick={handleDislike}
          >
            👎 {dislikes}
          </button>
        </div>

        <div className="comments-section">
          <svg
              width="566"
              height="2"
              viewBox="0 0 566 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H566" stroke="#F3F3F3" strokeWidth="2"/>
          </svg>

          <div className="comment-section-title">
            <h3 className="comment-title">Comment Section</h3>
            {comments.length > 2 && (
                <button
                    className="see-more-comments-btn"
                    onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments ? "Hide" : `See more (${comments.length - 2})`}
                </button>
            )}
          </div>

          {(showAllComments ? comments : comments.slice(-2)).map((comment, index) => (
              <div className="comment" key={index}>
                <div className="comment-upper">
                  <p className="comment-name">{comment.created_by}</p>
                  <p className="comment-date">
                    {new Date(comment.created_dt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div>
                  <p className="comment-description">{comment.comment_content}</p>
                </div>
              </div>
          ))}
          <svg
              width="566"
              height="2"
              viewBox="0 0 566 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H566" stroke="#F3F3F3" strokeWidth="2"/>
          </svg>
        </div>

        <div className="comment-input">
          <input
              type="text"
              id="commentText"
              placeholder="Write a comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
          />
          <button id="submitComment" onClick={handleAddComment}>
            <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M3.61088 12.8685C3.02755 12.8685 2.46172 12.641 2.01255 12.2035C1.28338 11.4918 1.10838 10.4418 1.56338 9.53182L2.50838 7.64182C2.70672 7.24516 2.70672 6.76682 2.50838 6.36432L1.56338 4.46849C1.10838 3.55849 1.28338 2.50849 2.01255 1.79682C2.74172 1.08516 3.79172 0.927656 4.69588 1.40599L11.4567 4.96432C12.2151 5.36099 12.6876 6.14266 12.6876 7.00016C12.6876 7.85766 12.2151 8.63932 11.4567 9.03599L4.69588 12.5943C4.34588 12.781 3.97838 12.8685 3.61088 12.8685Z"
                  fill="white"
              />
            </svg>
          </button>
        </div>
      </div>

      <EditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          reportData={reportData}
      />
    </div>
  );
};

export default ReportView;
