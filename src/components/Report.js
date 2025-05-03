import React, { useState } from "react";
import "../styles/Report.css";
import axios from "axios";

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

  const [comments, setComments] = useState([
    {
      name: "Admin",
      text: "Lorem Ipsum Dolor Sit amet",
      date: "22/09/2024",
    },
  ]);
  const [commentInput, setCommentInput] = useState("");

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Need to pass 2 parameters (report_id and comment_content )

      // Дороби, передавай правильно report_id, він якось має мабуть передаватись параметром в handleLike
      const payload = {
        ReportId: data.reportId.toString() || data.report_id.toString(),
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

  const [userReaction, setUserReaction] = useState(null); // 'like' | 'dislike' | null
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Need to pass 2 parameters (report_id and reaction_id )
      // Like_id = 1
      //Dislike_id = 2

      // Дороби, передавай правильно report_id, він якось має мабуть передаватись параметром в handleLike
      await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
          {
            ReportId: data.Data.reportId.toString(),
            ReactionId: "1", // LIKE
          },
          { headers }
      );

      if (userReaction === "like") {
        setLikes(likes - 1);
        setUserReaction(null);
      } else {
        if (userReaction === "dislike") {
          setDislikes(dislikes - 1);
        }
        setLikes(likes + 1);
        setUserReaction("like");
      }
    } catch (err) {
      console.error("Помилка при створенні реакції:", err);
    }
  };

  // Need to pass 2 parameters (report_id and reaction_id )
  // Like_id = 1
  //Dislike_id = 2
  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
          "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
          {
            ReportId: data.Data.reportId.toString(),
            ReactionId: "2", // DISLIKE
          },
          { headers }
      );

      if (userReaction === "dislike") {
        setDislikes(dislikes - 1);
        setUserReaction(null);
      } else {
        if (userReaction === "like") {
          setLikes(likes - 1);
        }
        setDislikes(dislikes + 1);
        setUserReaction("dislike");
      }
    } catch (err) {
      console.error("Помилка при створенні реакції:", err);
    }
  };

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
          width="514"
          height="2"
          viewBox="0 0 514 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1H514" stroke="#F3F3F3" strokeWidth="2" />
        </svg>

        <h3 className="comment-title">Comment Section</h3>

        {comments.map((comment, index) => (
          <div className="comment" key={index}>
            <div className="comment-upper">
              <p className="comment-name">{comment.name}</p>
              <p className="comment-date">{comment.date}</p>
            </div>
            <div>
              <p className="comment-description">{comment.text}</p>
            </div>
          </div>
        ))}

        <svg
          width="514"
          height="2"
          viewBox="0 0 514 2"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1H514" stroke="#F3F3F3" strokeWidth="2" />
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
  );
};

export default Report;
