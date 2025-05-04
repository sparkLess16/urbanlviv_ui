import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Report.css";
import axios from "axios";

const Report = ({ data }) => {
  const navigate = useNavigate();
  const {
    status_name,
    title,
    created_dt,
    description,
    location,
    attachment_url,
    total_likes,
    total_dislikes,
  } = data;

  const formattedDate = new Date(created_dt).toLocaleDateString();
  const attachments = Array.isArray(attachment_url)
    ? attachment_url
    : attachment_url
      ? [attachment_url]
      : [];

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
  const [likes, setLikes] = useState(total_likes || 0);
  const [dislikes, setDislikes] = useState(total_dislikes || 0);

  useEffect(() => {
    setLikes(data.total_likes || 0);
    setDislikes(data.total_dislikes || 0);
  }, [data.total_likes, data.total_dislikes]);

  useEffect(() => {
    const fetchComments = async () => {
      const reportId =
        data?.reportId?.toString() || data?.report_id?.toString();
      if (!reportId) return;

      try {
        const response = await axios.get(
          `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${reportId}/comments`
        );

        const fetchedComments = response.data.map((item) => ({
          name: item.author || "Anonymous",
          text: item.comment_context,
          date: new Date(item.created_dt).toLocaleDateString("en-GB"),
        }));

        setComments(fetchedComments);
      } catch (err) {
        console.error("Помилка при завантаженні коментарів:", err);
      }
    };
    fetchComments();
  }, [data]);

  const handleReportClick = (reportId) => {
    navigate(`/userAccount/${reportId}`);
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    const reportId = data?.reportId?.toString() || data?.report_id?.toString();

    if (!reportId) {
      console.error("Report ID is missing — cannot submit comment.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        ReportId: reportId,
        CommentContext: commentInput,
      };

      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-comment",
        payload,
        { headers }
      );

      const newComment = {
        name: "Admin",
        text: commentInput,
        date: new Date().toLocaleDateString("en-GB"),
      };
      setComments([...comments, newComment]);
      setCommentInput("");
    } catch (err) {
      console.error("Помилка при додаванні коментаря:", err);
    }
  };

  const handleLike = async () => {
    const reportId = data.reportId?.toString() || data.report_id?.toString();

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (userReaction === "like") {
        // Скасування лайку
        await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/remove-reaction",
          {
            ReportId: reportId,
          },
          { headers }
        );
        setLikes((prev) => prev - 1);
        setUserReaction(null);
      } else {
        // Додаємо лайк
        await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
          {
            ReportId: reportId,
            ReactionId: "1", // LIKE
          },
          { headers }
        );
        if (userReaction === "dislike") {
          setDislikes((prev) => prev - 1);
        }
        setLikes((prev) => prev + 1);
        setUserReaction("like");
      }
    } catch (err) {
      console.error("Помилка при створенні/скасуванні реакції:", err);
    }
  };

  const handleDislike = async () => {
    const reportId = data.reportId?.toString() || data.report_id?.toString();

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (userReaction === "dislike") {
        // Скасування дизлайку
        await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/remove-reaction",
          {
            ReportId: reportId,
          },
          { headers }
        );
        setDislikes((prev) => prev - 1);
        setUserReaction(null);
      } else {
        // Додаємо дизлайк
        await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
          {
            ReportId: reportId,
            ReactionId: "2", // DISLIKE
          },
          { headers }
        );
        if (userReaction === "like") {
          setLikes((prev) => prev - 1);
        }
        setDislikes((prev) => prev + 1);
        setUserReaction("dislike");
      }
    } catch (err) {
      console.error("Помилка при створенні/скасуванні реакції:", err);
    }
  };

  return (
    <div
      className="report-card"
      onClick={() =>
        handleReportClick(
          data?.reportId?.toString() || data?.report_id?.toString()
        )
      }
    >
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

      <div className="reaction-buttons">
        <button
          className={`reaction-btn ${userReaction === "like" ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // prevent report click
            handleLike();
          }}
        >
          ❤️ {likes}
        </button>

        <button
          className={`reaction-btn ${userReaction === "dislike" ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // prevent report click
            handleDislike();
          }}
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
          <path d="M0 1H566" stroke="#F3F3F3" strokeWidth="2" />
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

        {(showAllComments ? comments : comments.slice(-2)).map(
          (comment, index) => (
            <div className="comment" key={index}>
              <div className="comment-upper">
                <p className="comment-name">{comment.name}</p>
                <p className="comment-date">{comment.date}</p>
              </div>
              <div>
                <p className="comment-description">{comment.text}</p>
              </div>
            </div>
          )
        )}

        <svg
          width="566"
          height="2"
          viewBox="0 0 566 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1H566" stroke="#F3F3F3" strokeWidth="2" />
        </svg>
      </div>

      <div className="comment-input">
        <input
          type="text"
          id="commentText"
          placeholder="Write a comment"
          value={commentInput}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setCommentInput(e.target.value)}
        />

        <button
          id="submitComment"
          onClick={(e) => {
            e.stopPropagation();
            handleAddComment();
          }}
        >
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
  );
};

export default Report;
