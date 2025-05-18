import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditModal from "./EditModal";
import "../styles/ReportView.css";
import "../styles/Report.css";
import ConfirmDialog from "./ConfirmDialog";

const ReportView = () => {
  const { reportId } = useParams();
  const [allReportData, setAllReportData] = useState(null);
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
  const [attachments, setAttachments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = user?.data?.role_id;
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const userId = +JSON.parse(localStorage.getItem("user") || "{}")?.data
    ?.user_id;

  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1);
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
      const attachment = await axios.get(
        `http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/${reportId}/attachments`,
        { headers }
      );

      const raw = res.data.Data ?? res.data.data;
      const rpt = Array.isArray(raw) ? raw[0] : (raw ?? {});
      setReportData(rpt);
      setAllReportData(rpt);
      console.log(rpt);

      const files = attachment.data?.Data || [];
      setAttachments(files);
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
        console.log(comms);

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
    status_color,
    title,
    created_dt,
    description,
    location,
    created_by,
  } = reportData;

  const isReportCreator = created_by === userId;
  const isReportEditable = ![3, 4, 5].includes(reportData.status_id);
  const formattedDate = new Date(created_dt).toLocaleDateString();

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

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % attachments.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? attachments.length - 1 : prev - 1
    );
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
        <div
          style={{ backgroundColor: status_color }}
          className="report-status"
        >
          {status_name}
        </div>
        {attachments.length > 0 && (
          <div className="report-images">
            {attachments.length > 0 && (
              <div className="report-images-big">
                {attachments.map((file, i) => (
                  <div key={i}>
                    <img
                      src={file.file_object.Content}
                      alt={file.description || `attachment-${i}`}
                      className="report-image-big"
                      onClick={() => handleImageClick(i)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="report-header">
          <strong>{title}</strong>
          <span className="report-date">{formattedDate}</span>
        </div>

        <p className="report-description">{description}</p>
        {roleId === "2" && (
          <div className="admin-info-report">
            <div className="admin-info-summary">
              <p className="report-type margin">Official AI Summary</p>
              <p className="report-officialSummary margin">
                {allReportData.official_summary}
              </p>
            </div>
            <div className="admin-info-recommentations">
              <p className="report-type margin">AI Recommendations</p>
              <p className="report-recommendations margin">
                {allReportData.recommendations}
              </p>
            </div>
          </div>
        )}

        <div className="report-location-priority">
          <div className="report-details">
            <p className="report-type margin">Location</p>
            <p className="report-location">📍 {location}</p>
          </div>
          <div className="report-details">
            <p className="report-type margin">Priority</p>
            <p className="report-priority margin"> ⚠️ {priorityName}</p>
          </div>
          <div className="report-details">
            <p className="report-type margin">Type</p>
            <p className="report-priority margin"> 📄 {type}</p>
          </div>
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

        {!["Cancelled", "Resolved", "Rejected"].includes(status_name) && (
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

      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handlePrev}
              className="lightbox-nav left"
              disabled={attachments.length <= 1 || currentImageIndex === 0}
              style={{
                opacity:
                  attachments.length <= 1 || currentImageIndex === 0 ? 0.3 : 1,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.56945 18.8201C9.37945 18.8201 9.18945 18.7501 9.03945 18.6001L2.96945 12.5301C2.67945 12.2401 2.67945 11.7601 2.96945 11.4701L9.03945 5.40012C9.32945 5.11012 9.80945 5.11012 10.0995 5.40012C10.3895 5.69012 10.3895 6.17012 10.0995 6.46012L4.55945 12.0001L10.0995 17.5401C10.3895 17.8301 10.3895 18.3101 10.0995 18.6001C9.95945 18.7501 9.75945 18.8201 9.56945 18.8201Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z"
                  fill="#FFFFFF"
                />
              </svg>
            </button>
            <img
              src={attachments[currentImageIndex].file_object.Content}
              alt="Preview"
              className="lightbox-image"
            />
            <button
              onClick={handleNext}
              className="lightbox-nav right"
              disabled={
                attachments.length <= 1 ||
                currentImageIndex === attachments.length - 1
              }
              style={{
                opacity:
                  attachments.length <= 1 ||
                  currentImageIndex === attachments.length - 1
                    ? 0.3
                    : 1,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4301 18.8201C14.2401 18.8201 14.0501 18.7501 13.9001 18.6001C13.6101 18.3101 13.6101 17.8301 13.9001 17.5401L19.4401 12.0001L13.9001 6.46012C13.6101 6.17012 13.6101 5.69012 13.9001 5.40012C14.1901 5.11012 14.6701 5.11012 14.9601 5.40012L21.0301 11.4701C21.3201 11.7601 21.3201 12.2401 21.0301 12.5301L14.9601 18.6001C14.8101 18.7501 14.6201 18.8201 14.4301 18.8201Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M20.33 12.75H3.5C3.09 12.75 2.75 12.41 2.75 12C2.75 11.59 3.09 11.25 3.5 11.25H20.33C20.74 11.25 21.08 11.59 21.08 12C21.08 12.41 20.74 12.75 20.33 12.75Z"
                  fill="#FFFFFF"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
