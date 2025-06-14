import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ReportForm.css";
import "../styles/EditModal.css";
import ConfirmDialog from "./ConfirmDialog";

const EditModal = ({
  isOpen,
  onClose,
  reportData,
  priorities = [],
  types = [],
  photoInputs = [],
  previews,
  inputRefs,
  handlePhotoClick,
  handlePhotoChange,
  isSubmitting,
  onSubmitted,
}) => {
  const [editedTitle, setEditedTitle] = useState(reportData?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    reportData?.description || ""
  );
  const [editedPlace, setEditedPlace] = useState(reportData?.location || "");
  const [editedPriority, setEditedPriority] = useState(
    reportData?.priority_id || ""
  );
  const [editedType, setEditedType] = useState(
    reportData?.problem_type_id || ""
  );
  const [attachments, setAttachments] = useState({});
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (reportData) {
      setEditedTitle(reportData.title);
      setEditedDescription(reportData.description);
      setEditedPlace(reportData.location);
      setEditedPriority(reportData.priority_id);
      setEditedType(reportData.problem_type_id);
    }
  }, [reportData]);

  if (!isOpen && !showSuccessDialog) return null;

  if (showSuccessDialog) {
    return (
      <ConfirmDialog
        message={["Your report has been successfully updated."]}
        buttons={[
          {
            label: "Okay",
            variant: "primary",
            onClick: () => {
              setShowSuccessDialog(false);
            },
          },
        ]}
      />
    );
  }

  const submitReport = async () => {
    setIsSubmit(true);
    setError(null);

    const newErrors = {};
    if (!editedTitle.trim()) newErrors.title = "Required";
    if (!editedPriority) newErrors.priority = "Required";
    if (!editedType) newErrors.type = "Required";
    if (!editedDescription.trim()) newErrors.description = "Required";
    if (!editedPlace.trim()) newErrors.location = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmit(false);
      return;
    }

    try {
      const body = {
        ReportId: reportData.report_id.toString(),
        Title: editedTitle.trim(),
        Description: editedDescription.trim(),
        Location: editedPlace.trim(),
        PriorityId: parseInt(editedPriority),
        ProblemTypeId: parseInt(editedType),
        Attachments: Object.values(attachments),
      };

      const token = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      await axios.post(
        "http://urbanlviv-1627063708.us-east-1.elb.amazonaws.com/report/update",
        body,
        { headers }
      );

      if (onSubmitted) onSubmitted();
      onClose();
      setShowSuccessDialog(true);
      setEditedTitle("");
      setEditedPriority("");
      setEditedType("");
      setEditedDescription("");
      setEditedPlace("");
      setErrors({});
    } catch (err) {
      setError("Edit report failed");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop">
        <div className="edit-report-form">
          <div className="edit-report-form-upper">
            <h2 className="addRep edit-modal">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="7" fill="white" />
                <path
                  d="M22 28.75H9C8.04 28.75 7.25 27.96 7.25 27V14C7.25 9.58 9.58 7.25 14 7.25H22C26.42 7.25 28.75 9.58 28.75 14V22C28.75 26.42 26.42 28.75 22 28.75ZM14 8.75C10.42 8.75 8.75 10.42 8.75 14V27C8.75 27.14 8.86 27.25 9 27.25H22C25.58 27.25 27.25 25.58 27.25 22V14C27.25 10.42 25.58 8.75 22 8.75H14Z"
                  fill="#292D32"
                />
                <path
                  d="M21.5 18.75H14.5C14.09 18.75 13.75 18.41 13.75 18C13.75 17.59 14.09 17.25 14.5 17.25H21.5C21.91 17.25 22.25 17.59 22.25 18C22.25 18.41 21.91 18.75 21.5 18.75Z"
                  fill="#292D32"
                />
                <path
                  d="M18 22.25C17.59 22.25 17.25 21.91 17.25 21.5V14.5C17.25 14.09 17.59 13.75 18 13.75C18.41 13.75 18.75 14.09 18.75 14.5V21.5C18.75 21.91 18.41 22.25 18 22.25Z"
                  fill="#292D32"
                />
              </svg>
              Edit Report
            </h2>

            <button className="close-modal-btn" onClick={onClose}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="7" fill="black" />
                <path
                  d="M12 12L18 18M24 24L18 18M18 18L24 12M18 18L12 24"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          <div className="oneline">
            <div className="input-group wide">
              <label>Name of problem</label>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              {errors.title && <p className="error-message">{errors.title}</p>}
            </div>

            <div className="input-group wide">
              <label>Priority of Problem</label>
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value)}
              >
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="error-message">{errors.priority}</p>
              )}
            </div>
          </div>

          <div className="input-group full-width">
            <label>Type of Problem</label>
            <select
              value={editedType}
              onChange={(e) => setEditedType(e.target.value)}
            >
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.type && <p className="error-message">{errors.type}</p>}
          </div>

          <div className="input-group full-width">
            <label>Description</label>
            <textarea
              rows={3}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            {errors.description && (
              <p className="error-message">{errors.description}</p>
            )}
          </div>

          <div className="input-group full-width">
            <label>Place of happening</label>
            <input
              type="text"
              value={editedPlace}
              onChange={(e) => setEditedPlace(e.target.value)}
            />
            {errors.location && (
              <p className="error-message">{errors.location}</p>
            )}
          </div>

          <button onClick={submitReport} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
