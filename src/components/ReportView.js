import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditModal from "./EditModal";
import "../styles/ReportView.css";
import "../styles/Report.css";
import ConfirmDialog from "./ConfirmDialog";

const ReportView = () => {
  const { reportId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [priorities, setPriorities] = useState([]);
  const [priorityName, setpriorityName] = useState("");
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("");
  const [userReaction, setUserReaction] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessCancelDialog, setShowSuccessCancelDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const userId = +JSON.parse(localStorage.getItem("user") || "{}")?.data
    ?.user_id;

  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/userAccount");
  };

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      const res = await axios.get(
        `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${reportId}/details`,
        { headers }
      );

      const raw = res.data.Data ?? res.data.data;
      const rpt = Array.isArray(raw) ? raw[0] : (raw ?? {});
      setReportData(rpt);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  useEffect(() => {
    if (!reportData) return;

    setLikes(reportData.total_likes || 0);
    setDislikes(reportData.total_dislikes || 0);
    setpriorityName(reportData.priority_name || "");
    setType(reportData.problem_type);
    setUserReaction(
      reportData.user_liked
        ? "like"
        : reportData.user_disliked
          ? "dislike"
          : null
    );
    console.log(reportData);
  }, [reportData]);

  useEffect(() => {
    setReportData(null);
    setComments([]);
    setShowAllComments(false);
    setCommentInput("");

    fetchReport();
  }, [reportId]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!reportData) return;
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const reportId = (
          reportData.reportId || reportData.report_id
        ).toString();

        const res = await axios.get(
          `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${reportId}/comments`,
          { headers }
        );

        const comms = (res.data.Data || []).map((c) => ({
          created_by: c.created_by,
          comment_content: c.comment_content,
          created_dt: c.created_dt,
        }));

        setComments(comms);
      } catch (err) {
        console.error("Помилка при завантаженні коментарів:", err);
      }
    };
    fetchComments();
  }, [reportData]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/priorities",
        { headers }
      )
      .then((res) => {
        const raw = Array.isArray(res.data.Data) ? res.data.Data : [];
        const list = raw.map((item) => ({
          id: parseInt(item.priority_id, 10),
          name: item.priority_display_name || item.priority_name,
        }));
        setPriorities(list);
      })
      .catch((err) => {
        console.error("Failed to load priorities", err);
      });

    // Load problem types
    axios
      .get(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/problem-types",
        { headers }
      )
      .then((res) => {
        const raw = Array.isArray(res.data.Data) ? res.data.Data : [];
        const list = raw.map((item) => ({
          id: parseInt(item.problem_type_id, 10),
          name: item.problem_display_name || item.problem_name,
        }));
        setTypes(list);
      })
      .catch((err) => {
        console.error("Failed to load problem types", err);
      });
  }, []);

  if (!reportData) {
    return <div className="report-view-container">Loading...</div>;
  }

  const {
    status_name,
    title,
    created_dt,
    description,
    location,
    attachment_url,
    created_by,
  } = reportData;

  const isReportCreator = created_by === userId;
  const isReportEditable = ![3, 4, 5].includes(reportData.status_id);
  const formattedDate = new Date(created_dt).toLocaleDateString();
  const attachments = Array.isArray(attachment_url)
    ? attachment_url
    : attachment_url
      ? [attachment_url]
      : [];

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    const reportId = (
      reportData?.reportId || reportData?.report_id
    )?.toString();
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
      const firstName = me.data?.first_name || "";
      const lastName = me.data?.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "Anonymous";

      const newC = {
        created_by: fullName,
        comment_content: commentInput,
        created_dt: new Date().toISOString(),
      };

      setComments((prev) => [...prev, newC]);
      setCommentInput("");
    } catch (err) {
      console.error("Помилка при додаванні коментаря:", err);
    }
  };

  const handleLike = async () => {
    const id =
      reportData.reportId?.toString() || reportData.report_id?.toString();

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
        { ReportId: id, ReactionId: "1" },
        { headers }
      );

      if (userReaction === "like") {
        setLikes((prev) => prev - 1);
        setUserReaction(null);
      } else {
        if (userReaction === "dislike") setDislikes((prev) => prev - 1);
        setLikes((prev) => prev + 1);
        setUserReaction("like");
      }
    } catch (err) {
      console.error("Error handling like:", err);
    }
  };

  const handleDislike = async () => {
    const id =
      reportData.reportId?.toString() || reportData.report_id?.toString();

    try {
      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/create-reaction",
        { ReportId: id, ReactionId: "2" },
        { headers }
      );

      if (userReaction === "dislike") {
        setDislikes((prev) => prev - 1);
        setUserReaction(null);
      } else {
        if (userReaction === "like") setLikes((prev) => prev - 1);
        setDislikes((prev) => prev + 1);
        setUserReaction("dislike");
      }
    } catch (err) {
      console.error("Error handling dislike:", err);
    }
  };

  async function handleCancelReport() {
    const id =
      reportData.reportId?.toString() || reportData.report_id?.toString();

    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await axios.post(
        `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${id}/cancel`,
        null,
        { headers }
      );

      console.log("Cancel response:", response.data);
      setShowConfirm(false);
      setShowSuccessCancelDialog(true);
    } catch (error) {
      console.error("Cancel failed:", error.response?.data || error.message);
      setShowConfirm(false);
      setShowErrorDialog(true);
    }
  }

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
        {isReportCreator && isReportEditable && (
          <div className="actions-right">
            <button className="cancel-btn" onClick={() => setShowConfirm(true)}>
              Delete
            </button>
            {showConfirm && (
              <ConfirmDialog
                message={[
                  "Are you sure you want to cancel this report?",
                  "This action cannot be undone.",
                ]}
                buttons={[
                  {
                    label: "Yes, cancel",
                    variant: "danger",
                    onClick: () => {
                      setShowConfirm(false);
                      handleCancelReport();
                    },
                  },
                  {
                    label: "No, keep it",
                    variant: "default",
                    onClick: () => setShowConfirm(false),
                  },
                ]}
              />
            )}

            <button
              className="edit-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="view-container">
        <div className="report-status">{status_name}</div>
        {attachments.length > 0 && (
          <div className="report-images">
            {attachments.map((src, i) => (
              <img key={i} src={src} alt={`attachment-${i}`} />
            ))}
          </div>
        )}
        <p className="report-type">{type}</p>
        <div className="report-header">
          <strong>{title}</strong>
          <span className="report-date">{formattedDate}</span>
        </div>

        <p className="report-description">{description}</p>

        <div className="report-location-priority">
          <p className="report-location">📍 {location}</p>
          <p className="report-priority"> ⚠️ {priorityName}</p>
        </div>

        <div className="reaction-buttons">
          <button
            className={`reaction-btn ${userReaction === "like" ? "active" : ""}`}
            onClick={(e) => {
              handleLike();
            }}
          >
            ❤️ {likes}
          </button>

          <button
            className={`reaction-btn ${userReaction === "dislike" ? "active" : ""}`}
            onClick={(e) => {
              handleDislike();
            }}
          >
            👎 {dislikes}
          </button>
        </div>

        <div className="comments-section">
          <svg
            width="826"
            height="2"
            viewBox="0 0 826 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H826" stroke="#F3F3F3" strokeWidth="2" />
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
                  <p className="comment-name">{comment.created_by}</p>
                  <p className="comment-date">
                    {new Date(comment.created_dt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="comment-description">
                    {comment.comment_content}
                  </p>
                </div>
              </div>
            )
          )}
          <svg
            width="826"
            height="2"
            viewBox="0 0 826 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 1H826" stroke="#F3F3F3" strokeWidth="2" />
          </svg>
        </div>

        {status_name !== "Cancelled" && (
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
        )}
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reportData={reportData}
        priorities={priorities}
        types={types}
        onSubmitted={fetchReport}
      />

      {showErrorDialog && (
        <ConfirmDialog
          message={["Failed to cancel the report."]}
          buttons={[
            {
              label: "Close",
              variant: "default",
              onClick: () => setShowErrorDialog(false),
            },
          ]}
        />
      )}

      {showSuccessCancelDialog && (
        <ConfirmDialog
          message={["The report has been successfully cancelled."]}
          buttons={[
            {
              label: "Okay",
              variant: "primary",
              onClick: () => navigate("/userAccount"),
            },
          ]}
        />
      )}
    </div>
  );
};

export default ReportView;
