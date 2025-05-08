import React, { useEffect, useState } from "react";
import Toast from './Toast'
import axios from "axios";
import "../styles/ReportForm.css";
import "../styles/EditModal.css";

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
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const priority_id = reportData.priority_id;
  const problem_type_id = reportData.problem_type_id;
  const [attachments, setAttachments] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    if (reportData) {
      setEditedTitle(reportData.title);
      setEditedDescription(reportData.description);
      setEditedPriority(reportData.priority_name);
      setEditedType(reportData.problem_type);
      setEditedPlace(reportData.location);
    }
  }, [reportData]);


  const [editedPlace, setEditedPlace] = useState(reportData?.location || "");
  const [editedPriority, setEditedPriority] = useState(
    reportData?.priority_name || ""
  );
  const [editedType, setEditedType] = useState(reportData?.problem_type || "");

  if (!isOpen) return null;

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
    setErrors({});
    try {
      const Attachments = Object.values(attachments);

      const body = {
        ReportId : reportData.report_id.toString(),
        Title: editedTitle.trim(),
        Description: editedDescription.trim(),
        Location: editedPlace.trim(),
        PriorityId: parseInt(priority_id),
        ProblemTypeId: parseInt(problem_type_id),
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

      setToast({ show: true, message: 'Report edited successfully', type: 'success' });

      if (onSubmitted) {
        onSubmitted();
      }
      setEditedTitle("");
      editedPriority("");
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
        {toast.show && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(t => ({ ...t, show: false }))}
            />
        )}

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
                  <rect width="36" height="36" rx="7" fill="white"/>
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
                  <rect width="36" height="36" rx="7" fill="black"/>
                  <path
                      d="M12 12L18 18M24 24L18 18M18 18L24 12M18 18L12 24"
                      stroke="white"
                      stroke-width="1.5"
                  />
                </svg>
              </button>
            </div>
            <div className="oneline">
              <div className="input-group wide">
                <label>Name of problem</label>
                <input
                    type="text"
                    id="problemName"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
              <div className="input-group wide">
                <label>Priority of Problem</label>
                <select
                    id="status"
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value)}
                >
                  <option value="">Select priority</option>
                  {priorities.length > 0 ? (
                      priorities.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                      ))
                  ) : (
                      <option value="">No priorities available</option>
                  )}
                </select>
              </div>
            </div>
            <div className="input-group full-width">
              <label>Type of Problem</label>
              <select
                  id="type"
                  value={editedType}
                  onChange={(e) => setEditedType(e.target.value)}
              >
                <option value="">Select type</option>
                {types.length > 0 ? (
                    types.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                    ))
                ) : (
                    <option value="">No types available</option>
                )}
              </select>
            </div>
            <div className="input-group full-width">
              <label>Description</label>
              <textarea
                  id="description"
                  rows={3}
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>
            <div className="input-group full-width">
              <label>Place of happening</label>
              <input
                  type="text"
                  id="placeHapp"
                  value={editedPlace}
                  onChange={(e) => setEditedPlace(e.target.value)}
              />
            </div>
            <div className="input-group full-width">
              <label>Photo</label>
              <div id="photoContainer" className="photo-container full-width">
                {photoInputs.length > 0 ? (
                    photoInputs.map((id) => (
                        <div key={id} className="photo-upload-wrapper">
                          <div
                              className="photo-upload"
                              onClick={() => handlePhotoClick(id)}
                          >
                            {previews[id] ? (
                                <img
                                    src={previews[id]}
                                    alt="Preview"
                                    className="preview"
                                />
                            ) : (
                                <span>Add Photo</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                style={{display: "none"}}
                                ref={(el) => (inputRefs.current[id] = el)}
                                onChange={(e) => handlePhotoChange(e, id)}
                            />
                          </div>
                        </div>
                    ))
                ) : (
                    <div>No photos available</div>
                )}
              </div>
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
